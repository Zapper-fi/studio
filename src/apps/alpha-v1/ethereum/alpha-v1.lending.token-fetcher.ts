import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import ALPHA_V1_DEFINITION from '../alpha-v1.definition';
import { AlphaV1ContractFactory } from '../contracts';

type AlphaV1LendingTokenDataProps = {
  supplyApy: number;
  reserve: number;
  liquidity: number;
};

const appId = ALPHA_V1_DEFINITION.id;
const groupId = ALPHA_V1_DEFINITION.groups.lending.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumAlphaV1LendingTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AlphaV1ContractFactory)
    private readonly contractFactory: AlphaV1ContractFactory,
  ) {}

  private tripleSlope(utilization: BigNumber) {
    return utilization.lt(new BigNumber(0.8))
      ? utilization.times(new BigNumber(0.1)).div(new BigNumber(0.8))
      : utilization.lt(new BigNumber(0.9))
      ? new BigNumber(0.1)
      : new BigNumber(0.1).plus(
          utilization.minus(new BigNumber(0.9)).times(new BigNumber(0.4)).div(new BigNumber(0.1)),
        );
  }

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const ethToken = baseTokens.find(t => t.address === ZERO_ADDRESS);
    if (!ethToken) return [];
    const bankAddress = '0x67b66c99d3eb37fa76aa3ed1ff33e8e39f0b9c7a';
    const bankContract = this.contractFactory.alphaBank({ address: bankAddress, network });
    const tokenAddress = '0x67b66c99d3eb37fa76aa3ed1ff33e8e39f0b9c7a';
    const tokenContract = this.contractFactory.erc20({ address: tokenAddress, network });
    const [totalEthRaw, totalSupplyRaw, totalDebtValueRaw, symbol, decimals] = await Promise.all([
      multicall.wrap(bankContract).totalETH(),
      multicall.wrap(bankContract).totalSupply(),
      multicall.wrap(bankContract).glbDebtVal(),
      multicall.wrap(tokenContract).symbol(),
      multicall.wrap(tokenContract).decimals(),
    ]);

    // Data Props
    const price = (ethToken.price * Number(totalEthRaw)) / Number(totalSupplyRaw);
    const reserve = Number(totalEthRaw) / 10 ** ethToken.decimals;
    const supply = Number(totalSupplyRaw) / 10 ** decimals;
    const pricePerShare = Number(totalEthRaw) / Number(totalSupplyRaw);
    const utilizationRate = new BigNumber(totalDebtValueRaw.div(totalEthRaw).toString());
    const supplyApy = this.tripleSlope(utilizationRate).times(utilizationRate).times(0.9).toNumber();
    const tokens = [ethToken];
    const liquidity = price * supply;

    // Display Props
    const label = symbol;
    const secondaryLabel = buildDollarDisplayItem(price);
    const images = [getTokenImg(ethToken.address, network)];
    const statsItems = [
      { label: 'APY', value: buildPercentageDisplayItem(supplyApy) },
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
    ];

    const token: AppTokenPosition<AlphaV1LendingTokenDataProps> = {
      type: ContractType.APP_TOKEN,
      address: tokenAddress,
      appId,
      groupId,
      network,
      symbol,
      decimals,
      supply,
      price,
      pricePerShare,
      tokens,

      dataProps: {
        supplyApy,
        reserve,
        liquidity,
      },

      displayProps: {
        label,
        secondaryLabel,
        images,
        statsItems,
      },
    };

    return [token];
  }
}
