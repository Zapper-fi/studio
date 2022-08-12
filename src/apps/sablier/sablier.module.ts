import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { SablierStreamApiClient } from './common/sablier.stream.api-client';
import { SablierContractFactory } from './contracts';
import { EthereumSablierStreamLegacyContractPositionFetcher } from './ethereum/sablier.stream-legacy.contract-position-fetcher';
import { EthereumSablierStreamContractPositionFetcher } from './ethereum/sablier.stream.contract-position-fetcher';
import { SablierAppDefinition, SABLIER_DEFINITION } from './sablier.definition';

@Register.AppModule({
  appId: SABLIER_DEFINITION.id,
  providers: [
    SablierAppDefinition,
    SablierContractFactory,
    SablierStreamApiClient,
    EthereumSablierStreamLegacyContractPositionFetcher,
    EthereumSablierStreamContractPositionFetcher,
  ],
})
export class SablierAppModule extends AbstractApp() {}
