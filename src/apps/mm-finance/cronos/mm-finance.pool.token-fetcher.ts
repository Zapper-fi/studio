import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { UniswapV2PoolTokenHelper } from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MmFinanceChef, MmFinanceContractFactory, MmFinancePair } from '../contracts';
import { MM_FINANCE_DEFINITION } from '../mm-finance.definition';

import { CronosMmFinancePoolAddressCacheManager } from './mm-finance.pool.cache-manager';

const appId = MM_FINANCE_DEFINITION.id;
const groupId = MM_FINANCE_DEFINITION.groups.pool.id;
const network = Network.CRONOS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class CronosMmFinancePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(UniswapV2PoolTokenHelper)
    private readonly poolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(CronosMmFinancePoolAddressCacheManager)
    private readonly MmfinancePoolAddressCacheManager: CronosMmFinancePoolAddressCacheManager,
    @Inject(MmFinanceContractFactory) private readonly contractFactory: MmFinanceContractFactory, // @Inject(UniswapV2ContractFactory) private readonly uniswapV2ContractFactory: UniswapV2ContractFactory,
  ) {}

  getPositions() {
    return this.poolTokenHelper.getTokens<MmFinanceChef, MmFinancePair>({
      network,
      appId,
      groupId,
      minLiquidity: 10000,
      fee: 0.003,
      factoryAddress: '0xd590cc180601aecd6eeadd9b7f2b7611519544f4',
      resolveFactoryContract: opts => this.contractFactory.mmFinanceChef(opts),
      resolvePoolContract: opts => this.contractFactory.mmFinancePair(opts),
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
