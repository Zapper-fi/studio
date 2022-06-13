import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types';

import { MapleContractFactory } from '../contracts';
import { MapleCacheManager } from '../helpers/maple.cache-manager';
import { MAPLE_DEFINITION } from '../maple.definition';

export type MaplePoolTokenDataProps = {
  liquidity: number;
  apy: number;
};

const appId = MAPLE_DEFINITION.id;
const groupId = MAPLE_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({
  appId,
  groupId,
  network,
  options: { includeInTvl: true },
})
export class EthereumMaplePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MapleContractFactory) private readonly mapleContractFactory: MapleContractFactory,
    @Inject(MapleCacheManager) private readonly mapleCacheManager: MapleCacheManager,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const poolData = (await this.mapleCacheManager.getCachedPoolData()) ?? [];

    const poolTokens = await Promise.all(
      poolData.map(async pool => {
        const contract = this.mapleContractFactory.maplePool({ address: pool.poolAddress, network });
        const [underlyingTokenAddressRaw, symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).liquidityAsset(),
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        const underlyingToken = baseTokens.find(p => p.address == underlyingTokenAddressRaw.toLowerCase());
        if (!underlyingToken) return null;

        // Data Props
        const address = pool.poolAddress;
        const supply = Number(supplyRaw) / 10 ** decimals;
        const pricePerShare = 1;
        const price = underlyingToken.price;
        const tokens = [underlyingToken];
        const liquidity = price * supply;
        const apy = Number(pool.apy) / 10000;

        // Display Props
        const label = pool.poolName;
        const secondaryLabel = buildDollarDisplayItem(price);
        const tertiaryLabel = `${(apy * 100).toFixed(3)}% APY`;
        const images = [getTokenImg(underlyingToken.address, network)];
        const statsItems = [
          { label: 'APY', value: buildPercentageDisplayItem(apy) },
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
        ];

        const poolToken: AppTokenPosition<MaplePoolTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address,
          network,
          symbol,
          decimals,
          supply,
          pricePerShare,
          price,
          tokens,

          dataProps: {
            liquidity,
            apy,
          },

          displayProps: {
            label,
            secondaryLabel,
            tertiaryLabel,
            images,
            statsItems,
          },
        };

        return poolToken;
      }),
    );

    return compact(poolTokens);
  }
}
