import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

// import { CronosChainMmfinanceAutoMeerkatContractPositionFetcher } from './cronos/mmfinance.auto-Meerkat.contract-position-fetcher';
// import { CronosChainMmfinanceBalanceFetcher } from './cronos/mmfinance.balance-fetcher';
// import { CronosChainMmfinanceFarmV2ContractPositionFetcher } from './cronos/mmfinance.farm-v2.cotract-position-fetcher';
import { MmfinanceContractFactory } from './contracts';
// import { CronosChainMmfinanceIfoMeerkatContractPositionFetcher } from './cronos/mmfinance.ifo-Meerkat.contract-position-fetcher';
import { CronosChainMmfinancePoolAddressCacheManager } from './cronos/mmfinance.pool.cache-manager';
import { CronosChainMmfinancePoolTokenFetcher } from './cronos/mmfinance.pool.token-fetcher';
// import { CronosChainMmfinanceSyrupMeerkatContractPositionFetcher } from './cronos/mmfinance.syrup-Meerkat.contract-position-fetcher';
// import { CronosChainMmfinanceSyrupStakingContractPositionFetcher } from './cronos/mmfinance.syrup-staking.contract-position-fetcher';
import { MmfinanceAppDefinition, MMFINANCE_DEFINITION } from './mmfinance.definition';

@Register.AppModule({
  appId: MMFINANCE_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    MmfinanceAppDefinition,
    MmfinanceContractFactory,
    // CronosChainMmfinanceBalanceFetcher,
    // CronosChainMmfinanceAutoMeerkatContractPositionFetcher,
    // CronosChainMmfinanceIfoMeerkatContractPositionFetcher,
    // CronosChainMmfinanceFarmContractPositionFetcher,
    // CronosChainMmfinanceFarmV2ContractPositionFetcher,
    // CronosChainMmfinanceSyrupMeerkatContractPositionFetcher,
    // CronosChainMmfinanceSyrupStakingContractPositionFetcher,
    CronosChainMmfinancePoolTokenFetcher,
    CronosChainMmfinancePoolAddressCacheManager,
  ],
  exports: [MmfinanceContractFactory],
})
export class MmfinanceAppModule extends AbstractApp() { }
