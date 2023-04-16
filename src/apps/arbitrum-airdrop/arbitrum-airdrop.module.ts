import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumArbitrumAirdropAirdropContractPositionFetcher } from './arbitrum/arbitrum-airdrop.airdrop.contract-position-fetcher';
import { ArbitrumAirdropContractFactory } from './contracts';

@Module({
  providers: [ArbitrumAirdropContractFactory, ArbitrumArbitrumAirdropAirdropContractPositionFetcher],
})
export class ArbitrumAirdropAppModule extends AbstractApp() {}
