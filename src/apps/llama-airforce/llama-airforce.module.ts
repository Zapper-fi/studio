import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LlamaAirforceContractFactory } from './contracts';
import { EthereumLlamaAirforceAirdropContractPositionFetcher } from './ethereum/llama-airforce.airdrop.contract-position-fetcher';
import { EthereumLlamaAirforceBalanceFetcher } from './ethereum/llama-airforce.balance-fetcher';
import { EthereumLlamaAirforceVaultTokenFetcher } from './ethereum/llama-airforce.vault.token-fetcher';
import { LlamaAirforceAirdropBalancesHelper } from './helpers/llama-airforce.airdrop.balance-helper';
import { LlamaAirforceAppDefinition, LLAMA_AIRFORCE_DEFINITION } from './llama-airforce.definition';

@Register.AppModule({
  appId: LLAMA_AIRFORCE_DEFINITION.id,
  providers: [
    EthereumLlamaAirforceAirdropContractPositionFetcher,
    EthereumLlamaAirforceBalanceFetcher,
    EthereumLlamaAirforceVaultTokenFetcher,
    LlamaAirforceAirdropBalancesHelper,
    LlamaAirforceAppDefinition,
    LlamaAirforceContractFactory,
  ],
})
export class LlamaAirforceAppModule extends AbstractApp() {}
