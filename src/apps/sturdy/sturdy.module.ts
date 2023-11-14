import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { AaveAmmViemContractFactory } from '~apps/aave-amm/contracts';
import { AaveV2ViemContractFactory } from '~apps/aave-v2/contracts';

import { SturdyViemContractFactory } from './contracts';
import { EthereumSturdyPositionPresenter } from './ethereum/sturdy.position-presenter';
import { EthereumSturdyStableDebtTokenFetcher } from './ethereum/sturdy.stable-debt.token-fetcher';
import { EthereumSturdySupplyTokenFetcher } from './ethereum/sturdy.supply.token-fetcher';
import { EthereumSturdyVariableDebtTokenFetcher } from './ethereum/sturdy.variable-debt.token-fetcher';
import { FantomSturdyPositionPresenter } from './fantom/sturdy.position-presenter';
import { FantomSturdyStableDebtTokenFetcher } from './fantom/sturdy.stable-debt.token-fetcher';
import { FantomSturdySupplyTokenFetcher } from './fantom/sturdy.supply.token-fetcher';
import { FantomSturdyVariableDebtTokenFetcher } from './fantom/sturdy.variable-debt.token-fetcher';

@Module({
  providers: [
    SturdyViemContractFactory,
    AaveV2ViemContractFactory,
    AaveAmmViemContractFactory,
    // Ethereum
    EthereumSturdyPositionPresenter,
    EthereumSturdyStableDebtTokenFetcher,
    EthereumSturdySupplyTokenFetcher,
    EthereumSturdyVariableDebtTokenFetcher,
    // Fantom
    FantomSturdyPositionPresenter,
    FantomSturdyStableDebtTokenFetcher,
    FantomSturdySupplyTokenFetcher,
    FantomSturdyVariableDebtTokenFetcher,
  ],
})
export class SturdyAppModule extends AbstractApp() {}
