import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ViemContractFactory } from '~apps/uniswap-v2/contracts';

import { ArbitrumRamsesBribeContractPositionFetcher } from './arbitrum/ramses.bribe.contract-position-fetcher';
import { ArbitrumRamsesPoolTokenFetcher } from './arbitrum/ramses.pool.token-fetcher';
import { ArbitrumRamsesVotingEscrowContractPositionFetcher } from './arbitrum/ramses.voting-escrow.contract-position-fetcher';
import { RamsesViemContractFactory } from './contracts';

@Module({
  providers: [
    UniswapV2ViemContractFactory,
    RamsesViemContractFactory,
    ArbitrumRamsesPoolTokenFetcher,
    ArbitrumRamsesVotingEscrowContractPositionFetcher,
    ArbitrumRamsesBribeContractPositionFetcher,
  ],
})
export class RamsesAppModule extends AbstractApp() {}
