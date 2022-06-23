import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';
import { UniswapV2OnChainPoolTokenAddressStrategy } from '~apps/uniswap-v2/helpers/uniswap-v2.on-chain.pool-token-address-strategy';
import { UniswapV2PoolTokenHelper } from '~apps/uniswap-v2/helpers/uniswap-v2.pool.token-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { DIFFUSION_DEFINITION } from '../diffusion.definition';

const appId = DIFFUSION_DEFINITION.id;
const groupId = DIFFUSION_DEFINITION.groups.pool.id;
const network = Network.EVMOS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EvmosDiffusionPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(UniswapV2ContractFactory)
    private readonly uniswapV2ContractFactory: UniswapV2ContractFactory,
    @Inject(UniswapV2OnChainPoolTokenAddressStrategy)
    private readonly uniswapV2OnChainPoolTokenAddressStrategy: UniswapV2OnChainPoolTokenAddressStrategy,
    @Inject(UniswapV2PoolTokenHelper)
    @Inject(UniswapV2PoolTokenHelper)
    private readonly uniswapV2PoolTokenHelper: UniswapV2PoolTokenHelper,
  ) {}

  async getPositions() {
    return await this.uniswapV2PoolTokenHelper.getTokens({
      network,
      appId,
      groupId,
      factoryAddress: '0x6abdda34fb225be4610a2d153845e09429523cd2',
      resolveFactoryContract: ({ address, network }) =>
        this.uniswapV2ContractFactory.uniswapFactory({ address, network }),
      resolvePoolContract: ({ address, network }) => this.uniswapV2ContractFactory.uniswapPair({ address, network }),
      resolvePoolTokenAddresses: this.uniswapV2OnChainPoolTokenAddressStrategy.build({
        resolvePoolsLength: ({ multicall, factoryContract }) => multicall.wrap(factoryContract).allPairsLength(),
        resolvePoolAddress: ({ multicall, factoryContract, poolIndex }) =>
          multicall.wrap(factoryContract).allPairs(poolIndex),
      }),
      resolvePoolTokenSymbol: ({ multicall, poolContract }) => multicall.wrap(poolContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolContract }) => multicall.wrap(poolContract).totalSupply(),
      resolvePoolReserves: async ({ multicall, poolContract }) =>
        multicall
          .wrap(poolContract)
          .getReserves()
          .then(v => [v[0], v[1]]),
      resolvePoolUnderlyingTokenAddresses: async ({ multicall, poolContract }) =>
        Promise.all([multicall.wrap(poolContract).token0(), multicall.wrap(poolContract).token1()]),
    });
  }
}
