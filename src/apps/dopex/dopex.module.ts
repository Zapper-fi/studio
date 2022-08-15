import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumDopexDpxSsovContractPositionFetcher } from './arbitrum/dopex.dpx-ssov.contract-position-fetcher';
import { ArbitrumDopexEthSsovContractPositionFetcher } from './arbitrum/dopex.eth-ssov.contract-position-fetcher';
import { ArbitrumDopexFarmContractPositionFetcher } from './arbitrum/dopex.farm.contract-position-fetcher';
import { ArbitrumDopexGmxSsovContractPositionFetcher } from './arbitrum/dopex.gmx-ssov.contract-position-fetcher';
import { ArbitrumDopexGOhmSsovContractPositionFetcher } from './arbitrum/dopex.gohm-ssov.contract-position-fetcher';
import { ArbitrumDopexRdpxSsovContractPositionFetcher } from './arbitrum/dopex.rdpx-ssov.contract-position-fetcher';
import { ArbitrumDopexVotingEscrowRewardsContractPositionFetcher } from './arbitrum/dopex.voting-escrow-rewards.contract-position-fetcher';
import { ArbitrumDopexVotingEscrowContractPositionFetcher } from './arbitrum/dopex.voting-escrow.contract-position-fetcher';
import { DopexContractFactory } from './contracts';
import { DopexAppDefinition, DOPEX_DEFINITION } from './dopex.definition';

@Register.AppModule({
  appId: DOPEX_DEFINITION.id,
  providers: [
    DopexAppDefinition,
    DopexContractFactory,
    // Arbitrum
    ArbitrumDopexDpxSsovContractPositionFetcher,
    ArbitrumDopexRdpxSsovContractPositionFetcher,
    ArbitrumDopexEthSsovContractPositionFetcher,
    ArbitrumDopexFarmContractPositionFetcher,
    ArbitrumDopexGmxSsovContractPositionFetcher,
    ArbitrumDopexGOhmSsovContractPositionFetcher,
    ArbitrumDopexVotingEscrowContractPositionFetcher,
    ArbitrumDopexVotingEscrowRewardsContractPositionFetcher,
  ],
})
export class DopexAppModule extends AbstractApp() {}
