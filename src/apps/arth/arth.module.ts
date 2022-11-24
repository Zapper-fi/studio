import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArthAppDefinition, ARTH_DEFINITION } from './arth.definition';
import { ArthContractFactory } from './contracts';
import { EthereumArthStabilityPoolContractPositionFetcher } from './ethereum/arth.stability-pool.contract-position-fetcher';
import { EthereumArthTroveContractPositionFetcher } from './ethereum/arth.trove.contract-position-fetcher';

@Register.AppModule({
  appId: ARTH_DEFINITION.id,
  providers: [
    ArthAppDefinition,
    ArthContractFactory,
    EthereumArthStabilityPoolContractPositionFetcher,
    EthereumArthTroveContractPositionFetcher,
  ],
})
export class ArthAppModule extends AbstractApp() { }
