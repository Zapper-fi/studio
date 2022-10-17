import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumImpermaxBorrowContractPositionFetcher } from './arbitrum/impermax.borrow.contract-position-fetcher';
import { ArbitrumImpermaxCollateralTokenFetcher } from './arbitrum/impermax.collateral.token-fetcher';
import { ArbitrumImpermaxLendTokenFetcher } from './arbitrum/impermax.lend.token-fetcher';
import { ImpermaxContractFactory } from './contracts';
import { EthereumImpermaxBorrowContractPositionFetcher } from './ethereum/impermax.borrow.contract-position-fetcher';
import { EthereumImpermaxCollateralTokenFetcher } from './ethereum/impermax.collateral.token-fetcher';
import { EthereumImpermaxLendTokenFetcher } from './ethereum/impermax.lend.token-fetcher';
import { ImpermaxAppDefinition, IMPERMAX_DEFINITION } from './impermax.definition';
import { PolygonImpermaxBorrowContractPositionFetcher } from './polygon/impermax.borrow.contract-position-fetcher';
import { PolygonImpermaxCollateralTokenFetcher } from './polygon/impermax.collateral.token-fetcher';
import { PolygonImpermaxLendTokenFetcher } from './polygon/impermax.lend.token-fetcher';

@Register.AppModule({
  appId: IMPERMAX_DEFINITION.id,
  providers: [
    ArbitrumImpermaxBorrowContractPositionFetcher,
    ArbitrumImpermaxCollateralTokenFetcher,
    ArbitrumImpermaxLendTokenFetcher,
    EthereumImpermaxBorrowContractPositionFetcher,
    EthereumImpermaxCollateralTokenFetcher,
    EthereumImpermaxLendTokenFetcher,
    ImpermaxAppDefinition,
    ImpermaxContractFactory,
    PolygonImpermaxBorrowContractPositionFetcher,
    PolygonImpermaxCollateralTokenFetcher,
    PolygonImpermaxLendTokenFetcher,
  ],
})
export class ImpermaxAppModule extends AbstractApp() {}
