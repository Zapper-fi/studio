import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraVaporwaveFinanceFarmContractPositionFetcher } from './aurora/vaporwave-finance.farm.contract-position-fetcher';
import { AuroraVaporwaveFinanceVaultTokenFetcher } from './aurora/vaporwave-finance.vault.token-fetcher';
import { VaporwaveFinanceVaultDefinitionsResolver } from './common/vaporwave-finance.vault.token-definitions-resolver';
import { VaporwaveFinanceContractFactory } from './contracts';

@Module({
  providers: [
    VaporwaveFinanceContractFactory,
    VaporwaveFinanceVaultDefinitionsResolver,
    AuroraVaporwaveFinanceFarmContractPositionFetcher,
    AuroraVaporwaveFinanceVaultTokenFetcher,
  ],
})
export class VaporwaveFinanceAppModule extends AbstractApp() {}
