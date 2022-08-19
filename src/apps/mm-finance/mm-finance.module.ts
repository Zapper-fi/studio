import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { MmFinanceContractFactory } from './contracts';
import { CronosMmFinancePoolAddressCacheManager } from './cronos/mm-finance.pool.cache-manager';
import { CronosMmFinancePoolTokenFetcher } from './cronos/mm-finance.pool.token-fetcher';
import { MmFinanceAppDefinition, MM_FINANCE_DEFINITION } from './mm-finance.definition';

@Register.AppModule({
  appId: MM_FINANCE_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    MmFinanceAppDefinition,
    MmFinanceContractFactory,
    CronosMmFinancePoolTokenFetcher,
    CronosMmFinancePoolAddressCacheManager,
  ],
  exports: [MmFinanceContractFactory],
})
export class MmFinanceAppModule extends AbstractApp() {}
