import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CompoundLendingBalanceHelper } from '../compound/helper/compound.lending.balance-helper';
import { CompoundBorrowContractPositionHelper } from '../tarot/helper/compound.borrow.contract-position-helper'; // TODO: move to compound folder

import { ArbitrumImpermaxBalanceFetcher } from './arbitrum/impermax.balance-fetcher';
import { ArbitrumImpermaxBorrowContractPositionFetcher } from './arbitrum/impermax.borrow.contract-position-fetcher';
import { ArbitrumImpermaxCollateralTokenFetcher } from './arbitrum/impermax.collateral.token-fetcher';
import { ArbitrumImpermaxLendTokenFetcher } from './arbitrum/impermax.lend.token-fetcher';
import { ImpermaxContractFactory } from './contracts';
import { EthereumImpermaxBalanceFetcher } from './ethereum/impermax.balance-fetcher';
import { EthereumImpermaxBorrowContractPositionFetcher } from './ethereum/impermax.borrow.contract-position-fetcher';
import { EthereumImpermaxCollateralTokenFetcher } from './ethereum/impermax.collateral.token-fetcher';
import { EthereumImpermaxLendTokenFetcher } from './ethereum/impermax.lend.token-fetcher';
import { ImpermaxBalanceHelper } from './helpers/impermax.balance-helper';
import { ImpermaxCollateralTokenHelper } from './helpers/impermax.collateral.token-fetcher-helper';
import { ImpermaxLendTokenHelper } from './helpers/impermax.lend.token-fetcher-helper';
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
    EthereumImpermaxBalanceFetcher,
    EthereumImpermaxBorrowContractPositionFetcher,
    EthereumImpermaxCollateralTokenFetcher,
    EthereumImpermaxLendTokenFetcher,
    ImpermaxAppDefinition,
    ImpermaxContractFactory,
    ImpermaxBalanceHelper,
    ImpermaxCollateralTokenHelper,
    ImpermaxLendTokenHelper,
    PolygonImpermaxBalanceFetcher,
    PolygonImpermaxBorrowContractPositionFetcher,
    PolygonImpermaxCollateralTokenFetcher,
    PolygonImpermaxLendTokenFetcher,
  ],
})
export class ImpermaxAppModule extends AbstractApp() {}
