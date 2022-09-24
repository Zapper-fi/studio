import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ConcaveAppDefinition, CONCAVE_DEFINITION } from './concave.definition';
import { ConcaveContractFactory } from './contracts';
import { EthereumConcaveBalanceFetcher } from './ethereum/concave.balance-fetcher';
import { EthereumConcaveLsdcnvContractPositionFetcher } from './ethereum/concave.lsdcnv.contract-position-fetcher';

@Register.AppModule({
  appId: CONCAVE_DEFINITION.id,
  providers: [
    ConcaveAppDefinition,
    ConcaveContractFactory,
    EthereumConcaveBalanceFetcher,
    EthereumConcaveLsdcnvContractPositionFetcher,
  ],
})
export class ConcaveAppModule extends AbstractApp() {}
