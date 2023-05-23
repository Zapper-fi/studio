import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory } from '~apps/aave-v2/contracts';

import { ArbitrumGranaryFinancePositionPresenter } from './arbitrum/granary-finance.position-presenter';
import { ArbitrumGranaryFinanceStableDebtTokenFetcher } from './arbitrum/granary-finance.stable-debt.token-fetcher';
import { ArbitrumGranaryFinanceSupplyTokenFetcher } from './arbitrum/granary-finance.supply.token-fetcher';
import { ArbitrumGranaryFinanceVariableDebtTokenFetcher } from './arbitrum/granary-finance.variable-debt.token-fetcher';
import { GranaryFinanceContractFactory } from './contracts';
import { EthereumGranaryFinancePositionPresenter } from './ethereum/granary-finance.position-presenter';
import { EthereumGranaryFinanceStableDebtTokenFetcher } from './ethereum/granary-finance.stable-debt.token-fetcher';
import { EthereumGranaryFinanceSupplyTokenFetcher } from './ethereum/granary-finance.supply.token-fetcher';
import { EthereumGranaryFinanceVariableDebtTokenFetcher } from './ethereum/granary-finance.variable-debt.token-fetcher';
import { FantomGranaryFinancePositionPresenter } from './fantom/granary-finance.position-presenter';
import { FantomGranaryFinanceStableDebtTokenFetcher } from './fantom/granary-finance.stable-debt.token-fetcher';
import { FantomGranaryFinanceSupplyTokenFetcher } from './fantom/granary-finance.supply.token-fetcher';
import { FantomGranaryFinanceVariableDebtTokenFetcher } from './fantom/granary-finance.variable-debt.token-fetcher';
import { OptimismGranaryFinancePositionPresenter } from './optimism/granary-finance.position-presenter';
import { OptimismGranaryFinanceStableDebtTokenFetcher } from './optimism/granary-finance.stable-debt.token-fetcher';
import { OptimismGranaryFinanceSupplyTokenFetcher } from './optimism/granary-finance.supply.token-fetcher';
import { OptimismGranaryFinanceVariableDebtTokenFetcher } from './optimism/granary-finance.variable-debt.token-fetcher';

@Module({
  providers: [
    GranaryFinanceContractFactory,
    AaveV2ContractFactory,
    // Arbitrum
    ArbitrumGranaryFinancePositionPresenter,
    ArbitrumGranaryFinanceStableDebtTokenFetcher,
    ArbitrumGranaryFinanceSupplyTokenFetcher,
    ArbitrumGranaryFinanceVariableDebtTokenFetcher,
    // Ethereum
    EthereumGranaryFinancePositionPresenter,
    EthereumGranaryFinanceStableDebtTokenFetcher,
    EthereumGranaryFinanceSupplyTokenFetcher,
    EthereumGranaryFinanceVariableDebtTokenFetcher,
    // Fantom
    FantomGranaryFinancePositionPresenter,
    FantomGranaryFinanceStableDebtTokenFetcher,
    FantomGranaryFinanceSupplyTokenFetcher,
    FantomGranaryFinanceVariableDebtTokenFetcher,
    // Optimism
    OptimismGranaryFinancePositionPresenter,
    OptimismGranaryFinanceStableDebtTokenFetcher,
    OptimismGranaryFinanceSupplyTokenFetcher,
    OptimismGranaryFinanceVariableDebtTokenFetcher,
  ],
})
export class GranaryFinanceAppModule extends AbstractApp() {}
