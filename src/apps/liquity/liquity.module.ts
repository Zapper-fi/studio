import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LiquityContractFactory } from './contracts';
import { EthereumLiquityBalanceFetcher } from './ethereum/liquity.balance-fetcher';
import { EthereumLiquityFarmContractPositionFetcher } from './ethereum/liquity.farm.contract-position-fetcher';
import { LiquityStabilityPoolBalanceHelper } from './helpers/liquity.stability-pool.balance-helper';
import { LiquityTroveBalanceHelper } from './helpers/liquity.trove.balance-helper';
import LIQUITY_DEFINITION, { LiquityAppDefinition } from './liquity.definition';

@Register.AppModule({
  appId: LIQUITY_DEFINITION.id,
  providers: [
    LiquityAppDefinition,
    LiquityContractFactory,
    EthereumLiquityBalanceFetcher,
    EthereumLiquityFarmContractPositionFetcher,
    LiquityTroveBalanceHelper,
    LiquityStabilityPoolBalanceHelper,
  ],
  exports: [LiquityContractFactory, LiquityTroveBalanceHelper, LiquityStabilityPoolBalanceHelper],
})
export class LiquityAppModule extends AbstractApp() {}
