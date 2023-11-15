import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumImpermaxBorrowContractPositionFetcher } from './arbitrum/impermax.borrow.contract-position-fetcher';
import { ArbitrumImpermaxCollateralTokenFetcher } from './arbitrum/impermax.collateral.token-fetcher';
import { ArbitrumImpermaxLendTokenFetcher } from './arbitrum/impermax.lend.token-fetcher';
import { ArbitrumImpermaxPositionPresenter } from './arbitrum/impermax.position-presenter';
import { ImpermaxViemContractFactory } from './contracts';
import { EthereumImpermaxBorrowContractPositionFetcher } from './ethereum/impermax.borrow.contract-position-fetcher';
import { EthereumImpermaxCollateralTokenFetcher } from './ethereum/impermax.collateral.token-fetcher';
import { EthereumImpermaxLendTokenFetcher } from './ethereum/impermax.lend.token-fetcher';
import { EthereumImpermaxPositionPresenter } from './ethereum/impermax.position-presenter';
import { PolygonImpermaxBorrowContractPositionFetcher } from './polygon/impermax.borrow.contract-position-fetcher';
import { PolygonImpermaxCollateralTokenFetcher } from './polygon/impermax.collateral.token-fetcher';
import { PolygonImpermaxLendTokenFetcher } from './polygon/impermax.lend.token-fetcher';
import { PolygonImpermaxPositionPresenter } from './polygon/impermax.position-presenter';

@Module({
  providers: [
    ImpermaxViemContractFactory,
    // Arbitrum
    ArbitrumImpermaxPositionPresenter,
    ArbitrumImpermaxBorrowContractPositionFetcher,
    ArbitrumImpermaxCollateralTokenFetcher,
    ArbitrumImpermaxLendTokenFetcher,
    // Ethereum
    EthereumImpermaxPositionPresenter,
    EthereumImpermaxBorrowContractPositionFetcher,
    EthereumImpermaxCollateralTokenFetcher,
    EthereumImpermaxLendTokenFetcher,
    // Polygon
    PolygonImpermaxPositionPresenter,
    PolygonImpermaxBorrowContractPositionFetcher,
    PolygonImpermaxCollateralTokenFetcher,
    PolygonImpermaxLendTokenFetcher,
  ],
})
export class ImpermaxAppModule extends AbstractApp() {}
