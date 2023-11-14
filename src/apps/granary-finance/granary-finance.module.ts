import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ViemContractFactory } from '~apps/aave-v2/contracts';

import { ArbitrumGranaryFinancePositionPresenter } from './arbitrum/granary-finance.position-presenter';
import { ArbitrumGranaryFinanceSupplyTokenFetcher } from './arbitrum/granary-finance.supply.token-fetcher';
import { ArbitrumGranaryFinanceVariableDebtTokenFetcher } from './arbitrum/granary-finance.variable-debt.token-fetcher';
import { BaseGranaryFinancePositionPresenter } from './base/granary-finance.position-presenter';
import { BaseGranaryFinanceVariableDebtTokenFetcher } from './base/granary-finance.variable-debt.token-fetcher';
import { GranaryFinanceViemContractFactory } from './contracts';
import { EthereumGranaryFinancePositionPresenter } from './ethereum/granary-finance.position-presenter';
import { EthereumGranaryFinanceSupplyTokenFetcher } from './ethereum/granary-finance.supply.token-fetcher';
import { EthereumGranaryFinanceVariableDebtTokenFetcher } from './ethereum/granary-finance.variable-debt.token-fetcher';
import { FantomGranaryFinancePositionPresenter } from './fantom/granary-finance.position-presenter';
import { FantomGranaryFinanceSupplyTokenFetcher } from './fantom/granary-finance.supply.token-fetcher';
import { FantomGranaryFinanceVariableDebtTokenFetcher } from './fantom/granary-finance.variable-debt.token-fetcher';
import { OptimismGranaryFinancePositionPresenter } from './optimism/granary-finance.position-presenter';
import { OptimismGranaryFinanceSupplyTokenFetcher } from './optimism/granary-finance.supply.token-fetcher';
import { OptimismGranaryFinanceVariableDebtTokenFetcher } from './optimism/granary-finance.variable-debt.token-fetcher';

@Module({
  providers: [
    GranaryFinanceViemContractFactory,
    AaveV2ViemContractFactory,
    // Arbitrum
    ArbitrumGranaryFinancePositionPresenter,
    ArbitrumGranaryFinanceSupplyTokenFetcher,
    ArbitrumGranaryFinanceVariableDebtTokenFetcher,
    // Base
    BaseGranaryFinancePositionPresenter,
    BaseGranaryFinanceVariableDebtTokenFetcher,
    // Ethereum
    EthereumGranaryFinancePositionPresenter,
    EthereumGranaryFinanceSupplyTokenFetcher,
    EthereumGranaryFinanceVariableDebtTokenFetcher,
    // Fantom
    FantomGranaryFinancePositionPresenter,
    FantomGranaryFinanceSupplyTokenFetcher,
    FantomGranaryFinanceVariableDebtTokenFetcher,
    // Optimism
    OptimismGranaryFinancePositionPresenter,
    OptimismGranaryFinanceSupplyTokenFetcher,
    OptimismGranaryFinanceVariableDebtTokenFetcher,
  ],
})
export class GranaryFinanceAppModule extends AbstractApp() {}
