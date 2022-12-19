import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraBluebitFarmContractPositionFetcher } from './aurora/bluebit.farm.contract-position-fetcher';
import { AuroraBluebitVotingEscrowContractPositionFetcher } from './aurora/bluebit.voting-escrow.contract-position-fetcher';
import { BluebitAppDefinition, BLUEBIT_DEFINITION } from './bluebit.definition';
import { BluebitContractFactory } from './contracts';

@Register.AppModule({
  appId: BLUEBIT_DEFINITION.id,
  providers: [
    BluebitAppDefinition,
    BluebitContractFactory,
    // Aurora
    AuroraBluebitFarmContractPositionFetcher,
    AuroraBluebitVotingEscrowContractPositionFetcher,
  ],
})
export class BluebitAppModule extends AbstractApp() {}
