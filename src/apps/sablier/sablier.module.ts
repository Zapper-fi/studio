import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { SablierStreamLegacyApiClient } from './common/sablier.stream-legacy.api-client';
import { SablierStreamApiClient } from './common/sablier.stream.api-client';
import { SablierContractFactory } from './contracts';
import { EthereumSablierStreamLegacyContractPositionBalanceFetcher } from './ethereum/sablier.stream-legacy.contract-position-balance-fetcher';
import { EthereumSablierStreamLegacyContractPositionFetcher } from './ethereum/sablier.stream-legacy.contract-position-fetcher';
import { EthereumSablierStreamContractPositionBalanceFetcher } from './ethereum/sablier.stream.contract-position-balance-fetcher';
import { EthereumSablierStreamContractPositionFetcher } from './ethereum/sablier.stream.contract-position-fetcher';
import { SablierAppDefinition, SABLIER_DEFINITION } from './sablier.definition';

@Register.AppModule({
  appId: SABLIER_DEFINITION.id,
  providers: [
    SablierAppDefinition,
    SablierContractFactory,
    SablierStreamApiClient,
    SablierStreamLegacyApiClient,
    EthereumSablierStreamLegacyContractPositionBalanceFetcher,
    EthereumSablierStreamLegacyContractPositionFetcher,
    EthereumSablierStreamContractPositionBalanceFetcher,
    EthereumSablierStreamContractPositionFetcher,
  ],
})
export class SablierAppModule extends AbstractApp() {}
