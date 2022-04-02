import { Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { formatBytes32String } from 'ethers/lib/utils';
import { padEnd, sumBy } from 'lodash';
import Web3 from 'web3';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SynthetixContractFactory } from '../contracts';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

type GetMintrBalanceOptions = {
  address: string;
  network: Network;
  resolverAddress: string;
};

@Injectable()
export class SynthetixMintrBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) private readonly contractFactory: SynthetixContractFactory,
  ) {}

  async getBalances({ address, resolverAddress, network }: GetMintrBalanceOptions) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const snxToken = baseTokens.find(p => p.symbol === 'SNX')!;
    const susdToken = baseTokens.find(p => p.symbol === 'sUSD')!;

    // Resolve address of the Synthetix token contract
    const addressResolverContract = this.contractFactory.synthetixAddressResolver({
      address: resolverAddress,
      network,
    });

    // Get collateral and debt balances
    const synthTokenName = padEnd(Web3.utils.asciiToHex('Synthetix'), 66, '0');
    const synthTokenAddress = await addressResolverContract.getAddress(synthTokenName);
    const synthetixContract = this.contractFactory.synthetixNetworkToken({ address: synthTokenAddress, network });
    const [unlockedSnxRaw, collateralRaw, transferableRaw, debtBalanceRaw] = await Promise.all([
      multicall.wrap(synthetixContract).balanceOf(address),
      multicall.wrap(synthetixContract).collateral(address),
      multicall.wrap(synthetixContract).transferableSynthetix(address),
      multicall.wrap(synthetixContract).debtBalanceOf(address, formatBytes32String('sUSD')),
    ]);

    // Collateral and debt computations
    const collateralBalance = Number(collateralRaw) / 10 ** 18;
    const unlockedSnx = Number(unlockedSnxRaw) / 10 ** 18;
    const debtBalance = Number(debtBalanceRaw) / 10 ** 18;
    const collateralUSD = collateralBalance * snxToken.price;
    const debtBalanceUSD = -debtBalance * susdToken.price;
    const cRatio = debtBalance > 0 ? (collateralUSD / debtBalance) * 100 : 1;
    const escrowed = collateralBalance - unlockedSnx;
    const unexcrowed = collateralBalance - escrowed;

    const collateralBalanceRaw = new BigNumber(collateralRaw.toString()).minus(transferableRaw.toString()).toFixed(0);
    const collateralTokenBalance = drillBalance(supplied(snxToken), collateralBalanceRaw);
    const debtTokenBalance = drillBalance(borrowed(susdToken), debtBalanceRaw.toString(), { isDebt: true });
    const tokens = [collateralTokenBalance, debtTokenBalance];
    const balanceUSD = sumBy(tokens, t => t.balanceUSD);

    // Display Props
    const label = `Minted ${susdToken.symbol}`;
    const secondaryLabel = buildDollarDisplayItem(snxToken.price); // Could be c-ratio instead
    const images = [getTokenImg(snxToken.address, network), getTokenImg(susdToken.address, network)];

    const position: ContractPositionBalance = {
      type: ContractType.POSITION,
      address: synthTokenAddress,
      appId: SYNTHETIX_DEFINITION.id,
      groupId: SYNTHETIX_DEFINITION.groups.mintr.id,
      network,
      tokens,
      balanceUSD,
      dataProps: {},
      displayProps: {
        label,
        secondaryLabel,
        images,
      },
    };

    return {
      assets: [position],
      meta: [
        {
          label: 'Collateral',
          value: collateralUSD,
          type: 'dollar' as const,
        },
        {
          label: 'Debt',
          value: debtBalanceUSD,
          type: 'dollar' as const,
        },
        {
          label: 'C-Ratio',
          value: cRatio,
          type: 'pct' as const,
        },
        {
          label: 'Escrowed SNX',
          value: escrowed,
          type: 'number' as const,
        },
        {
          label: 'Unescrowed SNX',
          value: unexcrowed,
          type: 'number' as const,
        },
        {
          label: 'SNX Price',
          value: snxToken.price,
          type: 'dollar' as const,
        },
      ],
    };
  }
}
