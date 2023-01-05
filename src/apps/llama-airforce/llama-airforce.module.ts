import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LlamaAirforceContractFactory } from './contracts';
import { EthereumLlamaAirforceAirdropContractPositionFetcher } from './ethereum/llama-airforce.airdrop.contract-position-fetcher';
import { EthereumLlamaAirforceMerkleCache } from './ethereum/llama-airforce.merkle-cache';
import { EthereumLlamaAirforceVaultTokenFetcher } from './ethereum/llama-airforce.vault.token-fetcher';
import { LlamaAirforceAppDefinition } from './llama-airforce.definition';

@Module({
  providers: [
    LlamaAirforceAppDefinition,
    LlamaAirforceContractFactory,
    // Ethereum
    EthereumLlamaAirforceMerkleCache,
    EthereumLlamaAirforceAirdropContractPositionFetcher,
    EthereumLlamaAirforceVaultTokenFetcher,
  ],
})
export class LlamaAirforceAppModule extends AbstractApp() {}
