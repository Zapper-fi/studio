import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheGroBalanceFetcher } from './avalanche/gro.balance-fetcher';
import { AvalancheGroLabsTokenFetcher } from './avalanche/gro.labs.token-fetcher';
import { AvalancheGroPoolsContractPositionFetcher } from './avalanche/gro.pools.contract-position-fetcher';
import { AvalancheGroVestingContractPositionFetcher } from './avalanche/gro.vesting.contract-position-fetcher';
import { GroContractFactory } from './contracts';
import { EthereumGroBalanceFetcher } from './ethereum/gro.balance-fetcher';
import { EthereumGroLabsTokenFetcher } from './ethereum/gro.labs.token-fetcher';
import { EthereumGroPoolsContractPositionFetcher } from './ethereum/gro.pools.contract-position-fetcher';
import { EthereumGroVestingContractPositionFetcher } from './ethereum/gro.vesting.contract-position-fetcher';
import { GroAppDefinition, GRO_DEFINITION } from './gro.definition';

@Register.AppModule({
  appId: GRO_DEFINITION.id,
  providers: [
    GroAppDefinition,
    GroContractFactory,
    EthereumGroBalanceFetcher,
    EthereumGroPoolsContractPositionFetcher,
    EthereumGroVestingContractPositionFetcher,
    EthereumGroLabsTokenFetcher,
    AvalancheGroBalanceFetcher,
    AvalancheGroPoolsContractPositionFetcher,
    AvalancheGroVestingContractPositionFetcher,
    AvalancheGroLabsTokenFetcher,
  ],
})
export class GroAppModule extends AbstractApp() {}
