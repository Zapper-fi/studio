import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LlamaAirforceViemContractFactory } from './contracts';
import { EthereumLlamaAirforceAirdropContractPositionFetcher } from './ethereum/llama-airforce.airdrop.contract-position-fetcher';
import { EthereumLlamaAirforceMerkleCache } from './ethereum/llama-airforce.merkle-cache';

@Module({
  providers: [
    LlamaAirforceViemContractFactory,
    // Ethereum
    EthereumLlamaAirforceMerkleCache,
    EthereumLlamaAirforceAirdropContractPositionFetcher,
  ],
})
export class LlamaAirforceAppModule extends AbstractApp() {}
