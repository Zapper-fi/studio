import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumDopexDpxSsovContractPositionFetcher } from './arbitrum/dopex.dpx-ssov.contract-position-fetcher';
import { ArbitrumDopexEthSsovContractPositionFetcher } from './arbitrum/dopex.eth-ssov.contract-position-fetcher';
import { ArbitrumDopexFarmContractPositionFetcher } from './arbitrum/dopex.farm.contract-position-fetcher';
import { ArbitrumDopexGmxSsovContractPositionFetcher } from './arbitrum/dopex.gmx-ssov.contract-position-fetcher';
import { ArbitrumDopexGOhmSsovContractPositionFetcher } from './arbitrum/dopex.gohm-ssov.contract-position-fetcher';
import { ArbitrumDopexLpFarmContractPositionFetcher } from './arbitrum/dopex.lp-farm.contract-position-fetcher';
import { ArbitrumDopexRdpxSsovContractPositionFetcher } from './arbitrum/dopex.rdpx-ssov.contract-position-fetcher';
import { ArbitrumDopexVotingEscrowRewardsContractPositionFetcher } from './arbitrum/dopex.voting-escrow-rewards.contract-position-fetcher';
import { ArbitrumDopexVotingEscrowContractPositionFetcher } from './arbitrum/dopex.voting-escrow.contract-position-fetcher';
import { DopexContractFactory } from './contracts';
import { DopexAppDefinition } from './dopex.definition';

@Module({
  providers: [
    DopexAppDefinition,
    DopexContractFactory,
    // Arbitrum
    ArbitrumDopexFarmContractPositionFetcher,
    ArbitrumDopexLpFarmContractPositionFetcher,
    ArbitrumDopexDpxSsovContractPositionFetcher,
    ArbitrumDopexRdpxSsovContractPositionFetcher,
    ArbitrumDopexEthSsovContractPositionFetcher,
    ArbitrumDopexGmxSsovContractPositionFetcher,
    ArbitrumDopexGOhmSsovContractPositionFetcher,
    ArbitrumDopexVotingEscrowContractPositionFetcher,
    ArbitrumDopexVotingEscrowRewardsContractPositionFetcher,
  ],
})
export class DopexAppModule extends AbstractApp() {}
