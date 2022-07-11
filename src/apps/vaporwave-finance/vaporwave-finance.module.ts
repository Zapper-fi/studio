import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraVaporwaveFinanceBalanceFetcher } from './aurora/vaporwave-finance.balance-fetcher';
import { AuroraVaporwaveFinanceFarmContractPositionFetcher } from './aurora/vaporwave-finance.farm.contract-position-fetcher';
import { AuroraVaporwaveFinanceVaultTokenFetcher } from './aurora/vaporwave-finance.vault.token-fetcher';
import { VaporwaveFinanceContractFactory } from './contracts';
import { VaporwaveFinanceAppDefinition, VAPORWAVE_FINANCE_DEFINITION } from './vaporwave-finance.definition';

@Register.AppModule({
  appId: VAPORWAVE_FINANCE_DEFINITION.id,
  providers: [
    AuroraVaporwaveFinanceBalanceFetcher,
    AuroraVaporwaveFinanceFarmContractPositionFetcher,
    AuroraVaporwaveFinanceVaultTokenFetcher,
    VaporwaveFinanceAppDefinition,
    VaporwaveFinanceContractFactory,
  ],
})
export class VaporwaveFinanceAppModule extends AbstractApp() {}
