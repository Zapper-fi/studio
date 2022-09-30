import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { DystopiaContractFactory } from './contracts';
import { PolygonDystopiaStakingContractPositionFetcher } from './polygon/dystopia.farm.contract-position-fetcher';
import { PolygonDystopiaPairsTokenFetcher } from './polygon/dystopia.pool.token-fetcher';
import { PolygonDystopiaVotingEscrowContractPositionFetcher } from './polygon/dystopia.voting-escrow.contract-position-fetcher';
import { DystopiaAppDefinition, DYSTOPIA_DEFINITION } from './dystopia.definition';

@Register.AppModule({
  appId: DYSTOPIA_DEFINITION.id,
  providers: [
    PolygonDystopiaPairsTokenFetcher,
    PolygonDystopiaStakingContractPositionFetcher,
    PolygonDystopiaVotingEscrowContractPositionFetcher,
    DystopiaAppDefinition,
    DystopiaContractFactory,
  ],
})
export class DystopiaAppModule extends AbstractApp() { }
