import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

// import { CronosChainMmfinanceAutoCakeContractPositionFetcher } from './cronos/mmfinance.auto-cake.contract-position-fetcher';
// import { CronosChainMmfinanceBalanceFetcher } from './cronos/mmfinance.balance-fetcher';
// import { CronosChainMmfinanceFarmV2ContractPositionFetcher } from './cronos/mmfinance.farm-v2.cotract-position-fetcher';
import { MmfinanceContractFactory } from './contracts';
// import { CronosChainMmfinanceIfoCakeContractPositionFetcher } from './cronos/mmfinance.ifo-cake.contract-position-fetcher';
import { CronosChainMmfinancePoolAddressCacheManager } from './cronos/Mmfinance.pool.cache-manager';
import { CronosChainMmfinancePoolTokenFetcher } from './cronos/Mmfinance.pool.token-fetcher';
// import { CronosChainMmfinanceSyrupCakeContractPositionFetcher } from './cronos/mmfinance.syrup-cake.contract-position-fetcher';
// import { CronosChainMmfinanceSyrupStakingContractPositionFetcher } from './cronos/mmfinance.syrup-staking.contract-position-fetcher';
import { MmfinanceAppDefinition, MMFINANCE_DEFINITION } from './mmfinance.definition';

@Register.AppModule({
  appId: MMFINANCE_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    MmfinanceAppDefinition,
    MmfinanceContractFactory,
    // CronosChainMmfinanceBalanceFetcher,
    // CronosChainMmfinanceAutoCakeContractPositionFetcher,
    // CronosChainMmfinanceIfoCakeContractPositionFetcher,
    // CronosChainMmfinanceFarmContractPositionFetcher,
    // CronosChainMmfinanceFarmV2ContractPositionFetcher,
    // CronosChainMmfinanceSyrupCakeContractPositionFetcher,
    // CronosChainMmfinanceSyrupStakingContractPositionFetcher,
    CronosChainMmfinancePoolTokenFetcher,
    CronosChainMmfinancePoolAddressCacheManager,
  ],
  exports: [MmfinanceContractFactory],
})
export class MmfinanceAppModule extends AbstractApp() { }
