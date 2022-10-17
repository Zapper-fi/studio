import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ConcaveAppDefinition, CONCAVE_DEFINITION } from './concave.definition';
import { ConcaveContractFactory } from './contracts';
import { EthereumConcaveLiquidStakingContractPositionFetcher } from './ethereum/concave.liquid-staking.contract-position-fetcher';

@Register.AppModule({
  appId: CONCAVE_DEFINITION.id,
  providers: [
    ConcaveAppDefinition,
    ConcaveContractFactory,
    // Ethereum
    EthereumConcaveLiquidStakingContractPositionFetcher,
  ],
})
export class ConcaveAppModule extends AbstractApp() {}
