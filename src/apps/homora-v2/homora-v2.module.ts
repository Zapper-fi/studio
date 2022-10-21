import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheHomoraV2FarmContractPositionFetcher } from './avalanche/homora-v2.farm.contract-position-fetcher';
import { AvalancheHomoraV2LendingTokenFetcher } from './avalanche/homora-v2.lending.token-fetcher';
import { HomoraV2ContractFactory } from './contracts';
import { EthereumHomoraV2FarmContractPositionFetcher } from './ethereum/homora-v2.farm.contract-position-fetcher';
import { EthereumHomoraV2LendingTokenFetcher } from './ethereum/homora-v2.lending.token-fetcher';
import { FantomHomoraV2FarmContractPositionFetcher } from './fantom/homora-v2.farm.contract-position-fetcher';
import { FantomHomoraV2LendingTokenFetcher } from './fantom/homora-v2.lending.token-fetcher';
import { HomoraV2AppDefinition, HOMORA_V_2_DEFINITION } from './homora-v2.definition';
import { OptimismHomoraV2FarmContractPositionFetcher } from './optimism/homora-v2.farm.contract-position-fetcher';
import { OptimismHomoraV2LendingTokenFetcher } from './optimism/homora-v2.lending.token-fetcher';

@Register.AppModule({
  appId: HOMORA_V_2_DEFINITION.id,
  providers: [
    // Ethereum
    EthereumHomoraV2FarmContractPositionFetcher,
    EthereumHomoraV2LendingTokenFetcher,
    // Avalanche
    AvalancheHomoraV2FarmContractPositionFetcher,
    AvalancheHomoraV2LendingTokenFetcher,
    // Fantom
    FantomHomoraV2FarmContractPositionFetcher,
    FantomHomoraV2LendingTokenFetcher,
    // Optimism
    OptimismHomoraV2FarmContractPositionFetcher,
    OptimismHomoraV2LendingTokenFetcher,

    HomoraV2AppDefinition,
    HomoraV2ContractFactory,
  ],
})
export class HomoraV2AppModule extends AbstractApp() {}
