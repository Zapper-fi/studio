import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import { compact, padEnd, sumBy } from 'lodash';
import Web3 from 'web3';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { isBorrowed, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { MakerContractFactory, MakerGovernance } from '../contracts';
import { MAKER_DEFINITION } from '../maker.definition';

import { MakerVaultContractPositionDataProps } from './maker.vault.contract-position-fetcher';

const appId = MAKER_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

type MakerVaultContractPositionBalanceDataProps = {
  ilkName: string;
  cRatio: number;
};

@Register.BalanceFetcher(appId, network)
export class EthereumMakerBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MakerContractFactory) private readonly makerContractFactory: MakerContractFactory,
  ) {}

  private async getGovernanceBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<MakerGovernance>({
      address,
      appId: MAKER_DEFINITION.id,
      groupId: MAKER_DEFINITION.groups.governance.id,
      network: Network.ETHEREUM_MAINNET,
      resolveContract: ({ address, network }) => this.makerContractFactory.makerGovernance({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).deposits(address),
      resolveRewardTokenBalances: () => 0, // Autocompounds
    });
  }

  private async getCdpBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const positions = await this.appToolkit.getAppContractPositions<MakerVaultContractPositionDataProps>({
      appId: MAKER_DEFINITION.id,
      groupIds: [MAKER_DEFINITION.groups.vault.id],
      network,
    });

    // Get the user's proxy address
    const proxyRegAddress = '0x4678f0a6958e4d2bc4f1baf7bc52e8f3564f3fe4';
    const proxyRegContract = this.makerContractFactory.makerProxyRegistry({ address: proxyRegAddress, network });
    const proxyAddress = await proxyRegContract.proxies(address);
    if (proxyAddress === ZERO_ADDRESS) return [];

    // Get the user's urn
    const cdpManagerAddress = '0x5ef30b9986345249bc32d8928b7ee64de9435e39';
    const cdpManagerContract = this.makerContractFactory.makerCdpManager({ address: cdpManagerAddress, network });
    const cdp = await cdpManagerContract.first(proxyAddress);
    const urn = await cdpManagerContract.urns(cdp);

    // Gather balances
    const vatAddress = '0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b';
    const vatContract = this.makerContractFactory.makerVat({ address: vatAddress, network });
    const balances = await Promise.all(
      positions.map(async position => {
        const ilk = padEnd(Web3.utils.asciiToHex(position.dataProps.ilkName), 66, '0');
        const { ink, art } = await multicall.wrap(vatContract).urns(ilk, urn);

        const collateralToken = position.tokens.find(isSupplied);
        const debtToken = position.tokens.find(isBorrowed);
        if (!collateralToken || !debtToken) return null;

        // Data Props
        const collateralRaw = new BigNumber(ink.toString())
          .div(10 ** 18)
          .times(10 ** collateralToken.decimals)
          .toFixed(0);
        const debtRaw = new BigNumber(art.toString())
          .div(10 ** 18)
          .times(10 ** debtToken.decimals)
          .toFixed(0);
        const collateral = drillBalance(collateralToken, collateralRaw);
        const debt = drillBalance(debtToken, debtRaw, { isDebt: true });
        const tokens = [collateral, debt];
        const balanceUSD = sumBy(tokens, v => v.balanceUSD);
        const cRatio = debt.balanceUSD === 0 ? 0 : (collateral.balanceUSD / Math.abs(debt.balanceUSD)) * 100;
        const secondaryLabel = `C-Ratio: ${(cRatio * 100).toFixed(2)}%`;

        const positionBalance: ContractPositionBalance<MakerVaultContractPositionBalanceDataProps> = {
          type: ContractType.POSITION,
          address: position.address,
          appId: position.appId,
          groupId: position.groupId,
          network: position.network,
          tokens,
          balanceUSD,

          dataProps: {
            ilkName: position.dataProps.ilkName,
            cRatio,
          },

          displayProps: {
            label: position.displayProps.label,
            secondaryLabel: secondaryLabel,
            images: position.displayProps.images,
          },
        };

        return positionBalance;
      }),
    );

    return compact(balances);
  }

  async getBalances(address: string) {
    const [cdpBalances, governanceBalances] = await Promise.all([
      this.getCdpBalances(address),
      this.getGovernanceBalances(address),
    ]);

    const collateralUSD = sumBy(
      cdpBalances.map(v => v.tokens[0]),
      a => a.balanceUSD,
    );

    const debtUSD = sumBy(
      cdpBalances.map(v => v.tokens[1]),
      a => a.balanceUSD,
    );

    const cRatio = debtUSD === 0 ? 0 : (collateralUSD / Math.abs(debtUSD)) * 100;

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: [...cdpBalances],
        meta: [
          {
            label: 'Collateral',
            value: collateralUSD,
            type: 'dollar',
          },
          {
            label: 'Debt',
            value: debtUSD,
            type: 'dollar',
          },
          {
            label: 'C-Ratio',
            value: cRatio,
            type: 'pct',
          },
        ],
      },
      {
        label: 'Governance',
        assets: [...governanceBalances],
      },
    ]);
  }
}
