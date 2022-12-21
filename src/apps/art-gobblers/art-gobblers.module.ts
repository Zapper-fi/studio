import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArtGobblersAppDefinition, ART_GOBBLERS_DEFINITION } from './art-gobblers.definition';
import { ArtGobblersContractFactory } from './contracts';
import { EthereumArGobblersFactoryContractPositionFetcher } from './ethereum/art-gobblers.factory.contract-position-fetcher';

@Register.AppModule({
  appId: ART_GOBBLERS_DEFINITION.id,
  providers: [ArtGobblersAppDefinition, ArtGobblersContractFactory, EthereumArGobblersFactoryContractPositionFetcher],
})
export class ArtGobblersAppModule extends AbstractApp() {}
