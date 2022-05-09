import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import ALPHA_V1_DEFINITION, { AlphaV1AppDefinition } from './alpha-v1.definition';
import { AlphaV1ContractFactory } from './contracts';
import { EthereumAlphaV1BalanceFetcher } from './ethereum/alpha-v1.balance-fetcher';
import { EthereumAlphaV1LendingTokenFetcher } from './ethereum/alpha-v1.lending.token-fetcher';
import { EthereumAlphaV1TvlFetcher } from './ethereum/alpha-v1.tvl-fetcher';

@Register.AppModule({
  appId: ALPHA_V1_DEFINITION.id,
  providers: [
    AlphaV1AppDefinition,
    AlphaV1ContractFactory,
    EthereumAlphaV1BalanceFetcher,
    EthereumAlphaV1LendingTokenFetcher,
    EthereumAlphaV1TvlFetcher,
  ],
})
export class AlphaV1AppModule extends AbstractApp() {}
