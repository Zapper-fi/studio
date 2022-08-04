import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { AaveAmmAppModule } from '~apps/aave-amm/aave-amm.module';
import { AaveV2AppModule } from '~apps/aave-v2';

import { SturdyContractFactory } from './contracts';
import { EthereumSturdyBalanceFetcher } from './ethereum/sturdy.balance-fetcher';
import { EthereumSturdyStableDebtTokenFetcher } from './ethereum/sturdy.stable-debt.token-fetcher';
import { EthereumSturdySupplyTokenFetcher } from './ethereum/sturdy.supply.token-fetcher';
import { EthereumSturdyVariableDebtTokenFetcher } from './ethereum/sturdy.variable-debt.token-fetcher';
import { FantomSturdyBalanceFetcher } from './fantom/sturdy.balance-fetcher';
import { FantomSturdyStableDebtTokenFetcher } from './fantom/sturdy.stable-debt.token-fetcher';
import { FantomSturdySupplyTokenFetcher } from './fantom/sturdy.supply.token-fetcher';
import { FantomSturdyVariableDebtTokenFetcher } from './fantom/sturdy.variable-debt.token-fetcher';
import { SturdyAppDefinition, STURDY_DEFINITION } from './sturdy.definition';

@Register.AppModule({
  appId: STURDY_DEFINITION.id,
  imports: [AaveAmmAppModule, AaveV2AppModule],
  providers: [
    SturdyAppDefinition,
    SturdyContractFactory,
    // Ethereum
    EthereumSturdyBalanceFetcher,
    EthereumSturdySupplyTokenFetcher,
    EthereumSturdyStableDebtTokenFetcher,
    EthereumSturdyVariableDebtTokenFetcher,
    // Fantom
    FantomSturdyBalanceFetcher,
    FantomSturdySupplyTokenFetcher,
    FantomSturdyStableDebtTokenFetcher,
    FantomSturdyVariableDebtTokenFetcher,
  ],
})
export class SturdyAppModule extends AbstractApp() {}
