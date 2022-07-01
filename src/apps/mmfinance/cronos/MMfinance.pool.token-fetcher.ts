import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { UniswapPair, UniswapV2PoolTokenHelper } from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MMfinanceContractFactory, MMfinanceChef } from '../contracts';
import { MMFINANCE_DEFINITION } from '../mmfinance.definition';

import { CronosChainMMfinancePoolAddressCacheManager } from './MMfinance.pool.cache-manager';

const appId = MMFINANCE_DEFINITION.id;
const groupId = MMFINANCE_DEFINITION.groups.pool.id;
const network = Network.CRONOS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class CronosChainMMfinancePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(UniswapV2PoolTokenHelper)
    private readonly poolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(CronosChainMMfinancePoolAddressCacheManager)
    private readonly MMfinancePoolAddressCacheManager: CronosChainMMfinancePoolAddressCacheManager,
    @Inject(MMfinanceContractFactory) private readonly contractFactory: MMfinanceContractFactory, // @Inject(UniswapV2ContractFactory) private readonly uniswapV2ContractFactory: UniswapV2ContractFactory,
  ) { }

  getPositions() {
    return this.poolTokenHelper.getTokens<MMfinanceChef, UniswapPair>({
      network,
      appId,
      groupId,
      minLiquidity: 10000,
      fee: 0.003,
      factoryAddress: '0xd590cC180601AEcD6eeADD9B7f2B7611519544f4',
      resolveFactoryContract: opts => this.contractFactory.MMfinanceChef(opts),
      resolvePoolContract: opts => this.contractFactory.MMfinancePair(opts),
      resolvePoolTokenAddresses: () => this.MMfinancePoolAddressCacheManager.getPoolAddresses(),
      resolvePoolTokenSymbol: ({ multicall, poolContract }) => {
        // console.log(poolContract.address)
        return multicall.wrap(poolContract).symbol();
      },
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
