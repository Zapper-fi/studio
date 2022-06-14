import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { SturdyContractFactory } from './contracts';
import { EthereumSturdyBalanceFetcher } from './ethereum/sturdy.balance-fetcher';
import { EthereumSturdyLendingTokenFetcher } from './ethereum/sturdy.lending.token-fetcher';
import { EthereumSturdyTvlFetcher } from './ethereum/sturdy.tvl-fetcher';
import { FantomSturdyBalanceFetcher } from './fantom/sturdy.balance-fetcher';
import { FantomSturdyLendingTokenFetcher } from './fantom/sturdy.lending.token-fetcher';
import { FantomSturdyTvlFetcher } from './fantom/sturdy.tvl-fetcher';
import { SturdyAppDefinition, STURDY_DEFINITION } from './sturdy.definition';

@Register.AppModule({
  appId: STURDY_DEFINITION.id,
  providers: [
    EthereumSturdyBalanceFetcher,
    EthereumSturdyLendingTokenFetcher,
    EthereumSturdyTvlFetcher,
    FantomSturdyBalanceFetcher,
    FantomSturdyLendingTokenFetcher,
    FantomSturdyTvlFetcher,
    SturdyAppDefinition,
    SturdyContractFactory,
  ],
})
export class SturdyAppModule extends AbstractApp() {}
