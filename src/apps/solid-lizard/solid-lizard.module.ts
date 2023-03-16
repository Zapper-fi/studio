import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SolidLizardDefinitionsResolver } from './common/solid-lizard.definitions-resolver';
import { SolidLizardContractFactory } from './contracts';
import { ArbitrumSolidLizardBribeContractPositionFetcher } from './arbitrum/solid-lizard.bribe.contract-position-fetcher';
import { ArbitrumSolidLizardStakingContractPositionFetcher } from './arbitrum/solid-lizard.farm.contract-position-fetcher';
import { ArbitrumSolidLizardPoolsTokenFetcher } from './arbitrum/solid-lizard.pool.token-fetcher';
import { ArbitrumSolidLizardVotingEscrowContractPositionFetcher } from './arbitrum/solid-lizard.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    SolidLizardContractFactory,
    SolidLizardDefinitionsResolver,
    ArbitrumSolidLizardPoolsTokenFetcher,
    ArbitrumSolidLizardStakingContractPositionFetcher,
    ArbitrumSolidLizardVotingEscrowContractPositionFetcher,
    ArbitrumSolidLizardBribeContractPositionFetcher,
  ],
})
export class SolidLizardAppModule extends AbstractApp() { }
