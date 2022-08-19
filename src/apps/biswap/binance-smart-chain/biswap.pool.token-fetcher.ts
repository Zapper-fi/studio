import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { UniswapV2OnChainPoolTokenAddressStrategy, UniswapV2PoolTokenHelper } from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BISWAP_DEFINITION } from '../biswap.definition';
import { BiswapContractFactory } from '../contracts';

const appId = BISWAP_DEFINITION.id;
const groupId = BISWAP_DEFINITION.groups.pool.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainBiswapPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(UniswapV2PoolTokenHelper) private readonly poolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(BiswapContractFactory) private readonly contractFactory: BiswapContractFactory,
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
      factoryAddress: '0x858e3312ed3a876947ea49d572a7c42de08af7ee',
      resolveFactoryContract: ({ address, network }) =>
        this.contractFactory.biswapFactory({
          address,
          network,
        }),
      resolvePoolContract: ({ address, network }) => this.contractFactory.biswapPool({ address, network }),
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
