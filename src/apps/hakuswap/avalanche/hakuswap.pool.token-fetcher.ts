import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { UniswapV2OnChainPoolTokenAddressStrategy, UniswapV2PoolTokenHelper } from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { HakuswapContractFactory } from '../contracts';
import { HAKUSWAP_DEFINITION } from '../hakuswap.definition';

const appId = HAKUSWAP_DEFINITION.id;
const groupId = HAKUSWAP_DEFINITION.groups.pool.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheHakuswapPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(HakuswapContractFactory) private readonly hakuswapContractFactory: HakuswapContractFactory,
    @Inject(UniswapV2PoolTokenHelper) private readonly poolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(UniswapV2OnChainPoolTokenAddressStrategy)
    private readonly uniswapV2OnChainPoolTokenAddressStrategy: UniswapV2OnChainPoolTokenAddressStrategy,
  ) {}

  async getPositions() {
    return this.poolTokenHelper.getTokens({
      network,
      appId,
      groupId,
      minLiquidity: 10000,
      fee: 0.003,
      factoryAddress: '0x2db46feb38c57a6621bca4d97820e1fc1de40f41',
      resolveFactoryContract: ({ address, network }) =>
        this.hakuswapContractFactory.hakuswapFactory({
          address,
          network,
        }),
      resolvePoolContract: ({ address, network }) => this.hakuswapContractFactory.hakuswapPool({ address, network }),
      resolvePoolTokenAddresses: this.uniswapV2OnChainPoolTokenAddressStrategy.build({
        resolvePoolsLength: ({ multicall, factoryContract }) => multicall.wrap(factoryContract).allPairsLength(),
        resolvePoolAddress: ({ multicall, factoryContract, poolIndex }) =>
          multicall.wrap(factoryContract).allPairs(poolIndex),
      }),
      resolvePoolTokenSymbol: ({ multicall, poolContract }) => multicall.wrap(poolContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolContract }) => multicall.wrap(poolContract).totalSupply(),
      resolvePoolReserves: async ({ multicall, poolContract }) => {
        const reserves = await multicall.wrap(poolContract).getReserves();
        return [reserves[0], reserves[1]];
      },
      resolvePoolUnderlyingTokenAddresses: async ({ multicall, poolContract }) => {
        return Promise.all([multicall.wrap(poolContract).token0(), multicall.wrap(poolContract).token1()]);
      },
    });
  }
}
