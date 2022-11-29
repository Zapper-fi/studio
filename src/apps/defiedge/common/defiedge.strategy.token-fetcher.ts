import { Inject } from '@nestjs/common';
import axios from 'axios';
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
import { WithMetaType } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition, Token } from '~position/position.interface';
import { Network } from '~types';

import { DefiedgeContractFactory } from '../contracts';
import { Strategy } from '../types/defiedge.types';
import { DEFIEDGE_BASE_URL, expandTo18Decimals, filterNulls, getTokenPrice } from '../utils';

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
    const networkParam = this.network === Network.ETHEREUM_MAINNET ? 'mainnet' : this.network;
    const endpoint = `${DEFIEDGE_BASE_URL}/${networkParam}/strategies`;
    const multicall = this.appToolkit.getMulticall(this.network);

    const strategies = await axios.get<Strategy[]>(endpoint).then(({ data }) => data);

    const baseTokenAddressToDetails = await this.appToolkit.getBaseTokenPrices(this.network).then(baseTokens => {
      return _.keyBy(baseTokens, e => e.address.toLowerCase());
    });

    const appTokens = await Promise.all(
      strategies.map(async strategy => {
        const erc20Contract = this.defiedgeContractFactory.erc20({ address: strategy.address, network: this.network });
        const strategyContract = this.defiedgeContractFactory.strategy({
          address: strategy.address,
          network: this.network,
        });

        try {
          const [decimals, totalSupplyBN, aumWithFee, [token0, token1]] = await Promise.all([
            multicall.wrap(erc20Contract).decimals(),
            multicall.wrap(erc20Contract).totalSupply(),
            multicall.wrap(strategyContract).callStatic.getAUMWithFees(false),
            Promise.all(
              [strategy.token0, strategy.token1].map(async (t): Promise<WithMetaType<Token>> => {
                const baseToken = baseTokenAddressToDetails[t.id.toLowerCase()];
                const price = baseToken?.price ? baseToken.price : await getTokenPrice(t.symbol);

                return {
                  address: t.id,
                  decimals: +t.decimals,
                  network: this.network,
                  type: ContractType.BASE_TOKEN,
                  price: price ?? 0,
                  symbol: t.symbol,
                };
              }),
            ),
          ]);

          const { amount0, amount1 } = aumWithFee;
          const tokens = [token0, token1];

          const supply = Number(totalSupplyBN) / 10 ** decimals;

          let sharePrice = 100;
          let aum = 0;
          let pricePerShare: number[] = [0, 0];

          if (token0.price && token1.price && totalSupplyBN.gt(BigNumber.from(0))) {
            try {
              const t0Price = parseEther(token0.price.toString());
              const t1Price = parseEther(token1.price.toString());

              const aumBN = expandTo18Decimals(amount0, +token0.decimals)
                .mul(t0Price)
                .add(expandTo18Decimals(amount1, +token1.decimals).mul(t1Price));

              sharePrice = +Number(+formatEther(aumBN.div(totalSupplyBN))).toFixed(8) || 100;
              aum = +formatEther(aumBN) / 1e18;

              pricePerShare = [
                +formatEther(expandTo18Decimals(amount0, +token0.decimals).mul(t0Price)) / 1e18 / aum,
                +formatEther(expandTo18Decimals(amount1, +token1.decimals).mul(t1Price)) / 1e18 / aum,
              ];
            } catch (e) {
              // ignored
            }
          }

          const appToken: AppTokenPosition<StrategyTokenDataProps> = {
            type: ContractType.APP_TOKEN,
            address: strategy.address,
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
        } catch {
          return null;
        }
      }),
    );

    return appTokens.filter(filterNulls);
  }
}
