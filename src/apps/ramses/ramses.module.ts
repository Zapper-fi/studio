import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { RamsesDefinitionsResolver } from './common/ramses.definitions-resolver';
import { RamsesContractFactory } from './contracts';
import { ArbitrumRamsesBribeContractPositionFetcher } from './arbitrum/ramses.bribe.contract-position-fetcher';
import { ArbitrumRamsesStakingContractPositionFetcher } from './arbitrum/ramses.farm.contract-position-fetcher';
import { ArbitrumRamsesPoolsTokenFetcher } from './arbitrum/ramses.pool.token-fetcher';
import { ArbitrumRamsesVotingEscrowContractPositionFetcher } from './arbitrum/ramses.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    RamsesContractFactory,
    RamsesDefinitionsResolver,
    ArbitrumRamsesPoolsTokenFetcher,
    ArbitrumRamsesStakingContractPositionFetcher,
    ArbitrumRamsesVotingEscrowContractPositionFetcher,
    ArbitrumRamsesBribeContractPositionFetcher,
  ],
})
export class RamsesAppModule extends AbstractApp() { }
