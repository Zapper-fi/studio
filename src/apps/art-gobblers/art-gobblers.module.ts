import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArtGobblersAppDefinition, ART_GOBBLERS_DEFINITION } from './art-gobblers.definition';
import { ArtGobblersContractFactory } from './contracts';
import { EthereumArGobblersClaimableContractPositionFetcher } from './ethereum/art-gobblers.claimable.contract-position-fetcher';

@Register.AppModule({
  appId: ART_GOBBLERS_DEFINITION.id,
  providers: [ArtGobblersAppDefinition, ArtGobblersContractFactory, EthereumArGobblersClaimableContractPositionFetcher],
})
export class ArtGobblersAppModule extends AbstractApp() {}
