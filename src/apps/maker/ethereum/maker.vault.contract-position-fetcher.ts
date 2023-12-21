import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { compact, range, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { isBorrowed, isSupplied } from '~position/position.utils';
import {
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { MakerViemContractFactory } from '../contracts';
import { MakerGemJoin } from '../contracts/viem';

export type MakerVaultDefinition = {
  address: string;
  ilkName: string;
  collateralTokenAddress: string;
};

export type MakerVaultDataProps = {
  ilkName: string;
  cRatio?: number;
  cdpId?: number;
  liquidity: number;
  positionKey?: string;
};

@PositionTemplate()
export class EthereumMakerVaultContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  MakerGemJoin,
  MakerVaultDataProps,
  MakerVaultDefinition
> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MakerViemContractFactory) protected readonly contractFactory: MakerViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.makerGemJoin({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const ilkRegAddress = '0x5a464c28d19848f44199d003bef5ecc87d090f87';
    const ilkRegContract = this.contractFactory.makerIlkRegistry({ address: ilkRegAddress, network: this.network });
    const numIlks = await ilkRegContract.read.count();

    const definitions = await Promise.all(
      range(0, Number(numIlks)).map(async ilkIndex => {
        const ilk = await multicall.wrap(ilkRegContract).read.get([BigInt(ilkIndex)]);
        const [gem, join] = await Promise.all([
          multicall.wrap(ilkRegContract).read.gem([ilk]),
          multicall.wrap(ilkRegContract).read.join([ilk]),
        ]);

        const ilkName = ethers.utils.parseBytes32String(ilk);

        const address = join.toLowerCase();
        const collateralTokenAddress = gem.toLowerCase();
        return { address, ilkName, collateralTokenAddress };
      }),
    );

    return definitions;
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<MakerGemJoin, MakerVaultDefinition>): Promise<UnderlyingTokenDefinition[] | null> {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.collateralTokenAddress, // Vault Collateral
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
        network: this.network,
      },
    ];
  }

  async getDataProps({
    contractPosition,
    definition,
    multicall,
  }: GetDataPropsParams<MakerGemJoin, MakerVaultDataProps, MakerVaultDefinition>) {
    const collateralTokenContract = this.appToolkit.globalViemContracts.erc20({
      address: definition.collateralTokenAddress,
      network: this.network,
    });

    const balanceRaw = await (definition.collateralTokenAddress === ZERO_ADDRESS
      ? multicall.wrap(multicall.contract).read.getEthBalance([definition.address])
      : multicall.wrap(collateralTokenContract).read.balanceOf([definition.address]));

    const collateralToken = contractPosition.tokens[0];

    const balance = Number(balanceRaw) / 10 ** collateralToken.decimals;
    const liquidity = balance * collateralToken.price;

    return { ilkName: definition.ilkName, liquidity };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<MakerGemJoin, MakerVaultDataProps, MakerVaultDefinition>) {
    return `${contractPosition.dataProps.ilkName} Vault`;
  }

  async getTokenBalancesPerPosition(_params: GetTokenBalancesParams<MakerGemJoin>): Promise<ethers.BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<MakerVaultDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const positions = await this.appToolkit.getAppContractPositions<MakerVaultDataProps>({
      appId: this.appId,
      groupIds: [this.groupId],
      network: this.network,
    });

    // Get the user's proxy address
    const proxyRegAddress = '0x4678f0a6958e4d2bc4f1baf7bc52e8f3564f3fe4';
    const proxyRegContract = this.contractFactory.makerProxyRegistry({
      address: proxyRegAddress,
      network: this.network,
    });

    const proxyAddress = await proxyRegContract.read.proxies([address]);
    if (proxyAddress === ZERO_ADDRESS) return [];

    // Get the user's urn
    const cdpManagerAddress = '0x5ef30b9986345249bc32d8928b7ee64de9435e39';
    const cdpManagerContract = this.contractFactory.makerCdpManager({
      address: cdpManagerAddress,
      network: this.network,
    });

    // Retrieve all CDPs
    const cdps: number[] = [];
    let next = await cdpManagerContract.read.first([proxyAddress]).then(v => Number(v));
    while (next !== 0) {
      cdps.push(next);
      next = await cdpManagerContract.read.list([BigInt(next)]).then(v => Number(v[1]));
    }

    // Build balances across all CDPs
    const allPositions = await Promise.all(
      cdps.map(async cdp => {
        const urn = await cdpManagerContract.read.urns([BigInt(cdp)]);

        // Gather balances
        const vatAddress = '0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b';
        const vatContract = this.contractFactory.makerVat({ address: vatAddress, network: this.network });
        const balances = await Promise.all(
          positions.map(async position => {
            const ilk = ethers.utils.formatBytes32String(position.dataProps.ilkName);
            const [ink, art] = await multicall.wrap(vatContract).read.urns([ilk, urn.toLowerCase()]);
            const ilks = await multicall.wrap(vatContract).read.ilks([ilk]);
            const rate = new BigNumber(ilks[1].toString()).div(10 ** 27);

            const collateralToken = position.tokens.find(isSupplied);
            const debtToken = position.tokens.find(isBorrowed);
            if (!collateralToken || !debtToken) return null;

            // Data Props
            const collateralRaw = new BigNumber(ink.toString())
              .div(10 ** 18)
              .times(10 ** collateralToken.decimals)
              .toFixed(0);
            const artRaw = new BigNumber(art.toString()).div(10 ** 18).times(10 ** debtToken.decimals);

            const debtRaw = artRaw.times(rate).toFixed(0);

            const collateral = drillBalance(collateralToken, collateralRaw);
            const debt = drillBalance(debtToken, debtRaw, { isDebt: true });
            const tokens = [collateral, debt];
            const balanceUSD = sumBy(tokens, v => v.balanceUSD);
            const cRatio = debt.balanceUSD === 0 ? 0 : (collateral.balanceUSD / Math.abs(debt.balanceUSD)) * 100;
            const secondaryLabel = `C-Ratio: ${(cRatio * 100).toFixed(2)}%`;

            const positionBalance: ContractPositionBalance<MakerVaultDataProps> = {
              ...position,
              tokens,
              balanceUSD,

              dataProps: {
                ilkName: position.dataProps.ilkName,
                cdpId: cdp,
                cRatio,
                liquidity: position.dataProps.liquidity,
                positionKey: `${cdp}`,
              },

              displayProps: {
                label: position.displayProps.label,
                secondaryLabel: secondaryLabel,
                images: position.displayProps.images,
              },
            };

            positionBalance.key = this.appToolkit.getPositionKey(positionBalance);
            return positionBalance;
          }),
        );

        return compact(balances);
      }),
    );

    return compact(allPositions.flat());
  }
}
