import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { UniswapPair, UniswapV2PoolTokenHelper } from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MmfinanceContractFactory, MmfinanceChef } from '../contracts';
import { MMFINANCE_DEFINITION } from '../mmfinance.definition';

import { CronosChainMmfinancePoolAddressCacheManager } from './mmfinance.pool.cache-manager';

const appId = MMFINANCE_DEFINITION.id;
const groupId = MMFINANCE_DEFINITION.groups.pool.id;
const network = Network.CRONOS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class CronosChainMmfinancePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(UniswapV2PoolTokenHelper)
    private readonly poolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(CronosChainMmfinancePoolAddressCacheManager)
    private readonly MmfinancePoolAddressCacheManager: CronosChainMmfinancePoolAddressCacheManager,
    @Inject(MmfinanceContractFactory) private readonly contractFactory: MmfinanceContractFactory, // @Inject(UniswapV2ContractFactory) private readonly uniswapV2ContractFactory: UniswapV2ContractFactory,
  ) {}

  getPositions() {
    return this.poolTokenHelper.getTokens<MmfinanceChef, UniswapPair>({
      network,
      appId,
      groupId,
      minLiquidity: 10000,
      fee: 0.003,
      factoryAddress: '0xd590cC180601AEcD6eeADD9B7f2B7611519544f4',
      resolveFactoryContract: opts => this.contractFactory.mmfinanceChef(opts),
      resolvePoolContract: opts => this.contractFactory.mmfinancePair(opts),
      resolvePoolTokenAddresses: () => this.MmfinancePoolAddressCacheManager.getPoolAddresses(),
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
