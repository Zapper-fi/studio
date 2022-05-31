import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { OptimismContractFactory } from './contracts';
import { OptimismAppDefinition, OPTIMISM_DEFINITION } from './optimism.definition';
import { OptimismOptimismAirdropContractPositionBalanceFetcher } from './optimism/optimism.airdrop.contract-position-balance-fetcher';
import { OptimismOptimismAirdropContractPositionFetcher } from './optimism/optimism.airdrop.contract-position-fetcher';

@Register.AppModule({
  appId: OPTIMISM_DEFINITION.id,
  providers: [
    OptimismAppDefinition,
    OptimismContractFactory,
    OptimismOptimismAirdropContractPositionFetcher,
    OptimismOptimismAirdropContractPositionBalanceFetcher,
  ],
})
export class OptimismAppModule extends AbstractApp() {}
