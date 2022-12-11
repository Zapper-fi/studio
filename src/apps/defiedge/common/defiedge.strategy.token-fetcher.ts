import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types';

import { DefiedgeContractFactory } from '../contracts';
import { expandTo18Decimals, filterNulls, getDefiStrategies } from '../utils';

export type StrategyTokenDataProps = {
  sinceInception: number;
  sharePrice: number;
  aum: number;
};

export abstract class DefiedgeStrategyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  abstract network: Network;
  abstract appId: string;
  abstract groupId: string;

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(DefiedgeContractFactory) private readonly defiedgeContractFactory: DefiedgeContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(this.network);

    const [strategies, baseTokenAddressToDetails] = await Promise.all([
      getDefiStrategies(this.network),
      this.appToolkit.getBaseTokenPrices(this.network).then(baseTokens => {
        return _.keyBy(baseTokens, e => e.address.toLowerCase());
      }),
    ]);

    const appTokens = await Promise.allSettled(
      strategies.map(async strategy => {
        const erc20Contract = this.defiedgeContractFactory.erc20({ address: strategy.id, network: this.network });
        const strategyContract = this.defiedgeContractFactory.strategy({
          address: strategy.id,
          network: this.network,
        });

        const [decimals, totalSupplyBN, aumWithFee] = await Promise.all([
          multicall.wrap(erc20Contract).decimals(),
          multicall.wrap(erc20Contract).totalSupply(),
          multicall.wrap(strategyContract).callStatic.getAUMWithFees(false),
        ]);

        const token0 = baseTokenAddressToDetails[strategy.token0.id.toLowerCase()];
        const token1 = baseTokenAddressToDetails[strategy.token1.id.toLowerCase()];

        if (!token0 || !token1 || totalSupplyBN.lte(BigNumber.from(0))) return null;

        const tokens = [token0, token1];
        const supply = Number(totalSupplyBN) / 10 ** decimals;
        const { amount0, amount1 } = aumWithFee;
        const t0Price = parseEther(token0.price.toString());
        const t1Price = parseEther(token1.price.toString());

        const aumBN = expandTo18Decimals(amount0, +token0.decimals)
          .mul(t0Price)
          .add(expandTo18Decimals(amount1, +token1.decimals).mul(t1Price));

        const sharePrice = +Number(+formatEther(aumBN.div(totalSupplyBN))).toFixed(8) || 100;
        const aum = +formatEther(aumBN) / 1e18;

        const pricePerShare = [
          +formatEther(expandTo18Decimals(amount0, +token0.decimals).mul(t0Price)) / 1e18 / aum,
          +formatEther(expandTo18Decimals(amount1, +token1.decimals).mul(t1Price)) / 1e18 / aum,
        ];

        const appToken: AppTokenPosition<StrategyTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          address: strategy.id,
          appId: this.appId,
          tokens,
          decimals,
          groupId: this.groupId,
          network: this.network,
          supply,
          symbol: strategy.title,
          pricePerShare,
          price: sharePrice,
          dataProps: { aum, sharePrice, sinceInception: sharePrice - 100 },
          displayProps: {
            label: strategy.subTitle || strategy.title,
            secondaryLabel: strategy.subTitle ? undefined : strategy.title,
            images: tokens.map(getImagesFromToken).flat(),
            statsItems: [
              {
                label: 'AUM',
                value: buildDollarDisplayItem(aum),
              },
              {
                label: 'Since inception',
                value: buildPercentageDisplayItem(sharePrice - 100),
              },
            ],
          },
        };
        return appToken;
      }),
    );

    return appTokens.map(e => (e.status == 'fulfilled' ? e.value : null)).filter(filterNulls);
  }
}
