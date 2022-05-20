import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CompoundBorrowContractPositionHelper } from '../tarot/helper/compound.borrow.contract-position-helper';
import { CompoundLendingBalanceHelper } from '../tarot/helper/compound.lending.balance-helper';
import { CompoundSupplyTokenHelper } from '../tarot/helper/compound.supply.token-helper';

import { ArbitrumImpermaxBalanceFetcher } from './arbitrum/impermax.balance-fetcher';
import { ArbitrumImpermaxBorrowContractPositionFetcher } from './arbitrum/impermax.borrow.contract-position-fetcher';
import { ArbitrumImpermaxCollateralTokenFetcher } from './arbitrum/impermax.collateral.token-fetcher';
import { ArbitrumImpermaxLendTokenFetcher } from './arbitrum/impermax.lend.token-fetcher';
import { ImpermaxContractFactory } from './contracts';
import { EthereumImpermaxBalanceFetcher } from './ethereum/impermax.balance-fetcher';
import { EthereumImpermaxBorrowContractPositionFetcher } from './ethereum/impermax.borrow.contract-position-fetcher';
import { EthereumImpermaxCollateralTokenFetcher } from './ethereum/impermax.collateral.token-fetcher';
import { EthereumImpermaxLendTokenFetcher } from './ethereum/impermax.lend.token-fetcher';
import { ImpermaxAppDefinition, IMPERMAX_DEFINITION } from './impermax.definition';
import { PolygonImpermaxBalanceFetcher } from './polygon/impermax.balance-fetcher';
import { PolygonImpermaxBorrowContractPositionFetcher } from './polygon/impermax.borrow.contract-position-fetcher';
import { PolygonImpermaxCollateralTokenFetcher } from './polygon/impermax.collateral.token-fetcher';
import { PolygonImpermaxLendTokenFetcher } from './polygon/impermax.lend.token-fetcher';

@Register.AppModule({
  appId: IMPERMAX_DEFINITION.id,
  providers: [
    ArbitrumImpermaxBalanceFetcher,
    ArbitrumImpermaxBorrowContractPositionFetcher,
    ArbitrumImpermaxCollateralTokenFetcher,
    ArbitrumImpermaxLendTokenFetcher,
    CompoundBorrowContractPositionHelper,
    CompoundLendingBalanceHelper,
    CompoundSupplyTokenHelper,
    EthereumImpermaxBalanceFetcher,
    EthereumImpermaxBorrowContractPositionFetcher,
    EthereumImpermaxCollateralTokenFetcher,
    EthereumImpermaxLendTokenFetcher,
    ImpermaxAppDefinition,
    ImpermaxContractFactory,
    PolygonImpermaxBalanceFetcher,
    PolygonImpermaxBorrowContractPositionFetcher,
    PolygonImpermaxCollateralTokenFetcher,
    PolygonImpermaxLendTokenFetcher,
  ],
})
export class ImpermaxAppModule extends AbstractApp() {}
