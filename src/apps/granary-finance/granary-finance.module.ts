import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory } from '~apps/aave-v2';

import { GranaryFinanceContractFactory } from './contracts';
import { EthereumGranaryFinancePositionPresenter } from './ethereum/granary-finance.position-presenter';
import { EthereumGranaryFinanceStableDebtTokenFetcher } from './ethereum/granary-finance.stable-debt.token-fetcher';
import { EthereumGranaryFinanceSupplyTokenFetcher } from './ethereum/granary-finance.supply.token-fetcher';
import { EthereumGranaryFinanceVariableDebtTokenFetcher } from './ethereum/granary-finance.variable-debt.token-fetcher';
import { GranaryFinanceAppDefinition } from './granary-finance.definition';
import { OptimismGranaryFinancePositionPresenter } from './optimism/granary-finance.position-presenter';
import { OptimismGranaryFinanceStableDebtTokenFetcher } from './optimism/granary-finance.stable-debt.token-fetcher';
import { OptimismGranaryFinanceSupplyTokenFetcher } from './optimism/granary-finance.supply.token-fetcher';
import { OptimismGranaryFinanceVariableDebtTokenFetcher } from './optimism/granary-finance.variable-debt.token-fetcher';

@Module({
  providers: [
    GranaryFinanceAppDefinition,
    GranaryFinanceContractFactory,
    AaveV2ContractFactory,
    EthereumGranaryFinancePositionPresenter,
    EthereumGranaryFinanceStableDebtTokenFetcher,
    EthereumGranaryFinanceSupplyTokenFetcher,
    EthereumGranaryFinanceVariableDebtTokenFetcher,
    OptimismGranaryFinancePositionPresenter,
    OptimismGranaryFinanceStableDebtTokenFetcher,
    OptimismGranaryFinanceSupplyTokenFetcher,
    OptimismGranaryFinanceVariableDebtTokenFetcher,
  ],
})
export class GranaryFinanceAppModule extends AbstractApp() {}
