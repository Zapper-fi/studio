import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheGroLabsTokenFetcher } from './avalanche/gro.labs.token-fetcher';
import { GroContractFactory } from './contracts';
import { EthereumGroFarmContractPositionFetcher } from './ethereum/gro.farm.contract-position-fetcher';
import { EthereumGroVestingContractPositionFetcher } from './ethereum/gro.vesting.contract-position-fetcher';
import { GroAppDefinition, GRO_DEFINITION } from './gro.definition';

@Register.AppModule({
  appId: GRO_DEFINITION.id,
  providers: [
    GroAppDefinition,
    GroContractFactory,
    // Ethereum
    EthereumGroFarmContractPositionFetcher,
    EthereumGroVestingContractPositionFetcher,
    // Avalanche
    AvalancheGroLabsTokenFetcher,
  ],
})
export class GroAppModule extends AbstractApp() {}
