import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

// import { CronosChainMMfinanceAutoCakeContractPositionFetcher } from './cronos/mmfinance.auto-cake.contract-position-fetcher';
// import { CronosChainMMfinanceBalanceFetcher } from './cronos/mmfinance.balance-fetcher';
// import { CronosChainMMfinanceFarmV2ContractPositionFetcher } from './cronos/mmfinance.farm-v2.cotract-position-fetcher';
import { MMfinanceContractFactory } from './contracts';
// import { CronosChainMMfinanceIfoCakeContractPositionFetcher } from './cronos/mmfinance.ifo-cake.contract-position-fetcher';
import { CronosChainMMfinancePoolAddressCacheManager } from './cronos/MMfinance.pool.cache-manager';
import { CronosChainMMfinancePoolTokenFetcher } from './cronos/MMfinance.pool.token-fetcher';
// import { CronosChainMMfinanceSyrupCakeContractPositionFetcher } from './cronos/mmfinance.syrup-cake.contract-position-fetcher';
// import { CronosChainMMfinanceSyrupStakingContractPositionFetcher } from './cronos/mmfinance.syrup-staking.contract-position-fetcher';
import { MMfinanceAppDefinition, MMFINANCE_DEFINITION } from './mmfinance.definition';

@Register.AppModule({
  appId: MMFINANCE_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    MMfinanceAppDefinition,
    MMfinanceContractFactory,
    // CronosChainMMfinanceBalanceFetcher,
    // CronosChainMMfinanceAutoCakeContractPositionFetcher,
    // CronosChainMMfinanceIfoCakeContractPositionFetcher,
    // CronosChainMMfinanceFarmContractPositionFetcher,
    // CronosChainMMfinanceFarmV2ContractPositionFetcher,
    // CronosChainMMfinanceSyrupCakeContractPositionFetcher,
    // CronosChainMMfinanceSyrupStakingContractPositionFetcher,
    CronosChainMMfinancePoolTokenFetcher,
    CronosChainMMfinancePoolAddressCacheManager,
  ],
  exports: [MMfinanceContractFactory],
})
export class MMfinanceAppModule extends AbstractApp() { }
