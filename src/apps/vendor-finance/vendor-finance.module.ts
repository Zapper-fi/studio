import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumVendorFinanceBalanceFetcher } from './arbitrum/vendor-finance.balance-fetcher';
import { ArbitrumVendorFinancePoolContractPositionFetcher } from './arbitrum/vendor-finance.pool.contract-position-fetcher';
import { VendorFinanceContractFactory } from './contracts';
import { VendorFinanceAppDefinition, VENDOR_FINANCE_DEFINITION } from './vendor-finance.definition';

@Register.AppModule({
  appId: VENDOR_FINANCE_DEFINITION.id,
  providers: [
    ArbitrumVendorFinanceBalanceFetcher,
    ArbitrumVendorFinancePoolContractPositionFetcher,
    VendorFinanceAppDefinition,
    VendorFinanceContractFactory,
  ],
})
export class VendorFinanceAppModule extends AbstractApp() {}
