import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheSteakHutPoolContractPositionFetcher } from './avalanche/steak-hut.pool.contract-position-fetcher';
import { AvalancheSteakHutStakingContractPositionFetcher } from './avalanche/steak-hut.staking.contract-position-fetcher';
import { AvalancheSteakHutVeTokenFetcher } from './avalanche/steak-hut.ve.token-fetcher';
import { SteakHutContractFactory } from './contracts';
import { SteakHutAppDefinition, STEAK_HUT_DEFINITION } from './steak-hut.definition';

@Register.AppModule({
  appId: STEAK_HUT_DEFINITION.id,
  providers: [
    AvalancheSteakHutPoolContractPositionFetcher,
    AvalancheSteakHutStakingContractPositionFetcher,
    AvalancheSteakHutVeTokenFetcher,
    SteakHutAppDefinition,
    SteakHutContractFactory,
  ],
})
export class SteakHutAppModule extends AbstractApp() {}
