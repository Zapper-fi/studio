import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound';

import { ArbitrumCozyFinanceBalanceFetcher } from './arbitrum/cozy-finance.balance-fetcher';
import { ArbitrumCozyFinanceBorrowContractPositionFetcher } from './arbitrum/cozy-finance.borrow.contract-position-fetcher';
import { ArbitrumCozyFinanceSupplyTokenFetcher } from './arbitrum/cozy-finance.supply.token-fetcher';
import { CozyFinanceContractFactory } from './contracts';
import { CozyFinanceAppDefinition, COZY_FINANCE_DEFINITION } from './cozy-finance.definition';
import { EthereumCozyFinanceBalanceFetcher } from './ethereum/cozy-finance.balance-fetcher';
import { EthereumCozyFinanceBorrowContractPositionFetcher } from './ethereum/cozy-finance.borrow.contract-position-fetcher';
import { EthereumCozyFinanceSupplyTokenFetcher } from './ethereum/cozy-finance.supply.token-fetcher';

@Register.AppModule({
  appId: COZY_FINANCE_DEFINITION.id,
  imports: [CompoundAppModule],
  providers: [
    CozyFinanceAppDefinition,
    CozyFinanceContractFactory,
    // Arbitrum
    ArbitrumCozyFinanceBalanceFetcher,
    ArbitrumCozyFinanceBorrowContractPositionFetcher,
    ArbitrumCozyFinanceSupplyTokenFetcher,
    // Ethereum
    EthereumCozyFinanceBalanceFetcher,
    EthereumCozyFinanceBorrowContractPositionFetcher,
    EthereumCozyFinanceSupplyTokenFetcher,
  ],
})
export class CozyFinanceAppModule extends AbstractApp() {}
