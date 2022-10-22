import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheHomoraV2FarmContractPositionFetcher } from './avalanche/homora-v2.farm.contract-position-fetcher';
import { HomoraV2ContractFactory } from './contracts';
import { EthereumHomoraV2FarmContractPositionFetcher } from './ethereum/homora-v2.farm.contract-position-fetcher';
import { FantomHomoraV2FarmContractPositionFetcher } from './fantom/homora-v2.farm.contract-position-fetcher';
import { HomoraV2AppDefinition, HOMORA_V_2_DEFINITION } from './homora-v2.definition';
import { OptimismHomoraV2FarmContractPositionFetcher } from './optimism/homora-v2.farm.contract-position-fetcher';

@Register.AppModule({
  appId: HOMORA_V_2_DEFINITION.id,
  providers: [
    HomoraV2AppDefinition,
    HomoraV2ContractFactory,
    // Ethereum
    EthereumHomoraV2FarmContractPositionFetcher,
    // Avalanche
    AvalancheHomoraV2FarmContractPositionFetcher,
    // Fantom
    FantomHomoraV2FarmContractPositionFetcher,
    // Optimism
    OptimismHomoraV2FarmContractPositionFetcher,
  ],
})
export class HomoraV2AppModule extends AbstractApp() {}
