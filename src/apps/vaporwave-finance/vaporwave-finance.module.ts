import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraVaporwaveFinanceFarmContractPositionFetcher } from './aurora/vaporwave-finance.farm.contract-position-fetcher';
import { AuroraVaporwaveFinanceVaultTokenFetcher } from './aurora/vaporwave-finance.vault.token-fetcher';
import { VaporwaveFinanceVaultDefinitionsResolver } from './common/vaporwave-finance.vault.token-definitions-resolver';
import { VaporwaveFinanceContractFactory } from './contracts';
import { VaporwaveFinanceAppDefinition, VAPORWAVE_FINANCE_DEFINITION } from './vaporwave-finance.definition';

@Register.AppModule({
  appId: VAPORWAVE_FINANCE_DEFINITION.id,
  providers: [
    VaporwaveFinanceAppDefinition,
    VaporwaveFinanceContractFactory,
    VaporwaveFinanceVaultDefinitionsResolver,
    AuroraVaporwaveFinanceFarmContractPositionFetcher,
    AuroraVaporwaveFinanceVaultTokenFetcher,
  ],
})
export class VaporwaveFinanceAppModule extends AbstractApp() {}
