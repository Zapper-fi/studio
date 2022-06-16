import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { UniswapPair, UniswapV2ContractFactory, UniswapV2PoolTokenHelper } from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PancakeswapContractFactory, PancakeswapChef } from '../contracts';
import { PANCAKESWAP_DEFINITION } from '../pancakeswap.definition';

import { BinanceSmartChainPancakeswapPoolAddressCacheManager } from './pancakeswap.pool.cache-manager';

const appId = PANCAKESWAP_DEFINITION.id;
const groupId = PANCAKESWAP_DEFINITION.groups.pool.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class BinanceSmartChainPancakeSwapPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(UniswapV2PoolTokenHelper)
    private readonly poolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(BinanceSmartChainPancakeswapPoolAddressCacheManager)
    private readonly pancakeswapPoolAddressCacheManager: BinanceSmartChainPancakeswapPoolAddressCacheManager,
    @Inject(PancakeswapContractFactory) private readonly contractFactory: PancakeswapContractFactory,
    @Inject(UniswapV2ContractFactory) private readonly uniswapV2ContractFactory: UniswapV2ContractFactory,
  ) {}

  getPositions() {
    return this.poolTokenHelper.getTokens<PancakeswapChef, UniswapPair>({
      network,
      appId,
      groupId,
      minLiquidity: 10000,
      fee: 0.003,
      factoryAddress: '0x73feaa1ee314f8c655e354234017be2193c9e24e',
      resolveFactoryContract: opts => this.contractFactory.pancakeswapChef(opts),
      resolvePoolContract: opts => this.uniswapV2ContractFactory.uniswapPair(opts),
      resolvePoolTokenAddresses: () => this.pancakeswapPoolAddressCacheManager.getPoolAddresses(),
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
