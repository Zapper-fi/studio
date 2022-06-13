import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LlamaAirforceContractFactory } from './contracts';
import { EthereumLlamaAirforceAirdropContractPositionBalanceFetcher } from './ethereum/llama-airforce.airdrop.contract-position-balance-fetcher';
import { EthereumLlamaAirforceAirdropContractPositionFetcher } from './ethereum/llama-airforce.airdrop.contract-position-fetcher';
import { EthereumLlamaAirforceMerkleCache } from './ethereum/llama-airforce.merkle-cache';
import { EthereumLlamaAirforceVaultTokenFetcher } from './ethereum/llama-airforce.vault.token-fetcher';
import { LlamaAirforceAppDefinition, LLAMA_AIRFORCE_DEFINITION } from './llama-airforce.definition';

@Register.AppModule({
  appId: LLAMA_AIRFORCE_DEFINITION.id,
  providers: [
    LlamaAirforceAppDefinition,
    LlamaAirforceContractFactory,
    // Ethereum
    EthereumLlamaAirforceMerkleCache,
    EthereumLlamaAirforceAirdropContractPositionFetcher,
    EthereumLlamaAirforceAirdropContractPositionBalanceFetcher,
    EthereumLlamaAirforceVaultTokenFetcher,
  ],
})
export class LlamaAirforceAppModule extends AbstractApp() {}
