import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LiquityContractFactory } from './contracts';
import { EthereumLiquityStabilityPoolContractPositionFetcher } from './ethereum/liquity.stability-pool.contract-position-fetcher';
import { EthereumLiquityStakingContractPositionFetcher } from './ethereum/liquity.staking.contract-position-fetcher';
import { EthereumLiquityTroveContractPositionFetcher } from './ethereum/liquity.trove.contract-position-fetcher';
import { LIQUITY_DEFINITION, LiquityAppDefinition } from './liquity.definition';

@Register.AppModule({
  appId: LIQUITY_DEFINITION.id,
  providers: [
    LiquityAppDefinition,
    LiquityContractFactory,
    EthereumLiquityStabilityPoolContractPositionFetcher,
    EthereumLiquityStakingContractPositionFetcher,
    EthereumLiquityTroveContractPositionFetcher,
  ],
})
export class LiquityAppModule extends AbstractApp() {}
