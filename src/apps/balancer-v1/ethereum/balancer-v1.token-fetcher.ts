import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import BALANCER_V1_DEFINITION from '../balancer-v1.definition';
import { getAllPoolsData } from '../balancer-v1.utils';

const appId = BALANCER_V1_DEFINITION.id;
const groupId = BALANCER_V1_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({
  appId,
  groupId,
  network,
})
export class EthereumBalancerV1PoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const graphHelper = this.appToolkit.helpers.theGraphHelper;

    const ts = Math.round(new Date().getTime() / 1000);
    const tsYesterday = ts - 24 * 3600;
    const data = await getAllPoolsData(tsYesterday, graphHelper);

    const validPools = data.pools.filter(pool => {
      const unavailableTokens = ['cDAI', 'cUSDT', 'cWBTC', 'cBAT', 'cZRX', 'cETH', 'cREP', 'cUSDC', 'YAM'];
      const hasSomeTokens = pool.tokens.length > 0;
      const hasValidSupply = Number(pool.totalShares) > 0;
      const hasAllPrices = pool.tokens.every(t => baseTokens.find(p => p.address === t.address.toLowerCase()));
      const hasNoUnavailableTokens = pool.tokens.every(t => !unavailableTokens.includes(t.symbol));
      return hasSomeTokens && hasValidSupply && hasAllPrices && hasNoUnavailableTokens;
    });

    const poolTokens = validPools.map(pool => {
      // Build underlying tokens
      const tokensRaw = pool.tokens
        .sort((a, b) => +b.denormWeight / +pool.totalWeight - +a.denormWeight / +pool.totalWeight)
        .map(token => {
          const tokenMatch = baseTokens.find(price => token.symbol === price.symbol);
          if (!tokenMatch) return null;
          return { ...tokenMatch };
        });

      if (!tokensRaw) return null;
      const tokens = _.compact(tokensRaw);

      const address = pool.id;
      const decimals = 18;
      const symbol = tokens.map(t => t.symbol).join(' / ');
      const label = symbol;
      const liquidity = Number(pool.liquidity);
      const supply = Number(pool.totalShares);
      const weight = pool.tokens.map(t => Number(t.denormWeight) / Number(pool.totalWeight));
      const reserves = pool.tokens.map(t => Number(t.balance));
      const price = liquidity / supply;
      const pricePerShare = reserves.map(r => r / supply);
      const fee = Number(pool.swapFee);
      const lastVolume = pool.swaps.length > 0 ? +pool.swaps[0].poolTotalSwapVolume : +pool.totalSwapVolume;
      const volume = +pool.totalSwapVolume - lastVolume;
      const secondaryLabel = weight.map(p => `${Math.round(p * 100)}%`).join(' / ');

      const displayProps = {
        label,
        secondaryLabel,
        images: tokens.map(t => getTokenImg(t.address, t.network)),
        statsItems: [
          {
            label: 'Liquidity',
            value: buildDollarDisplayItem(liquidity),
          },
          {
            label: 'Supply',
            value: buildNumberDisplayItem(supply),
          },
          {
            label: 'Volume',
            value: buildDollarDisplayItem(volume),
          },
          {
            label: 'Fee',
            value: buildPercentageDisplayItem(fee),
          },
        ],
      };

      const dataProps = {
        liquidity,
        fee,
        volume,
        lastVolume,
        reserves,
        weight,
      };

      const token: AppTokenPosition = {
        address,
        type: ContractType.APP_TOKEN,
        network,
        appId,
        groupId,
        symbol,
        decimals,
        supply,
        price,
        pricePerShare,
        tokens,
        dataProps,
        displayProps,
      };

      return token;
    });

    return _.compact(poolTokens);
  }
}
