import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraBluebitFarmContractPositionFetcher } from './aurora/bluebit.farm.contract-position-fetcher';
import { AuroraBluebitVotingEscrowContractPositionFetcher } from './aurora/bluebit.voting-escrow.contract-position-fetcher';
import { BluebitAppDefinition } from './bluebit.definition';
import { BluebitContractFactory } from './contracts';

@Module({
  providers: [
    BluebitAppDefinition,
    BluebitContractFactory,
    // Aurora
    AuroraBluebitFarmContractPositionFetcher,
    AuroraBluebitVotingEscrowContractPositionFetcher,
  ],
})
export class BluebitAppModule extends AbstractApp() {}
