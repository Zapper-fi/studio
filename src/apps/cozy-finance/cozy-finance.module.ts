import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumCozyFinanceBorrowContractPositionFetcher } from './arbitrum/cozy-finance.borrow.contract-position-fetcher';
import { ArbitrumCozyFinancePositionPresenter } from './arbitrum/cozy-finance.position-presenter';
import { ArbitrumCozyFinanceSupplyTokenFetcher } from './arbitrum/cozy-finance.supply.token-fetcher';
import { CozyFinanceContractFactory } from './contracts';
import { CozyFinanceAppDefinition, COZY_FINANCE_DEFINITION } from './cozy-finance.definition';
import { EthereumCozyFinanceBorrowContractPositionFetcher } from './ethereum/cozy-finance.borrow.contract-position-fetcher';
import { EthereumCozyFinancePositionPresenter } from './ethereum/cozy-finance.position-presenter';
import { EthereumCozyFinanceSupplyTokenFetcher } from './ethereum/cozy-finance.supply.token-fetcher';

@Register.AppModule({
  appId: COZY_FINANCE_DEFINITION.id,
  providers: [
    CozyFinanceAppDefinition,
    CozyFinanceContractFactory,
    // Arbitrum
    ArbitrumCozyFinanceBorrowContractPositionFetcher,
    ArbitrumCozyFinancePositionPresenter,
    ArbitrumCozyFinanceSupplyTokenFetcher,
    // Ethereum
    EthereumCozyFinancePositionPresenter,
    EthereumCozyFinanceBorrowContractPositionFetcher,
    EthereumCozyFinanceSupplyTokenFetcher,
  ],
})
export class CozyFinanceAppModule extends AbstractApp() {}
