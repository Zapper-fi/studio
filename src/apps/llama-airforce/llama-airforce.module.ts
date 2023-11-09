import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LlamaAirforceViemContractFactory } from './contracts';
import { EthereumLlamaAirforceAirdropContractPositionFetcher } from './ethereum/llama-airforce.airdrop.contract-position-fetcher';
import { EthereumLlamaAirforceMerkleCache } from './ethereum/llama-airforce.merkle-cache';
import { EthereumLlamaAirforceVaultTokenFetcher } from './ethereum/llama-airforce.vault.token-fetcher';

@Module({
  providers: [
    LlamaAirforceViemContractFactory,
    // Ethereum
    EthereumLlamaAirforceMerkleCache,
    EthereumLlamaAirforceAirdropContractPositionFetcher,
    EthereumLlamaAirforceVaultTokenFetcher,
  ],
})
export class LlamaAirforceAppModule extends AbstractApp() {}
