import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumQiDaoVaultPositionFetcher } from './arbitrum/qi-dao.vault.contract-position-fetcher';
import { QiDaoContractFactory } from './contracts';
import { FantomQiDaoFarmContractPositionFetcher } from './fantom/qi-dao.farm.contract-position-fetcher';
import { FantomQiDaoVaultPositionFetcher } from './fantom/qi-dao.vault.contract-position-fetcher';
import { GnosisQiDaoVaultPositionFetcher } from './gnosis/qi-dao.vault.contract-position-fetcher';
import { OptimismQiDaoVaultPositionFetcher } from './optimism/qi-dao.vault.contract-position-fetcher';
import { PolygonQiDaoEscrowedQiContractPositionFetcher } from './polygon/qi-dao.escrowed-qi.contract-position-fetcher';
import { PolygonQiDaoFarmContractPositionFetcher } from './polygon/qi-dao.farm.contract-position-fetcher';
import { PolygonQiDaoVaultPositionFetcher } from './polygon/qi-dao.vault.contract-position-fetcher';
import { PolygonQiDaoYieldTokenFetcher } from './polygon/qi-dao.yield.token-fetcher';

@Module({
  providers: [
    QiDaoContractFactory,
    // Fantom
    FantomQiDaoFarmContractPositionFetcher,
    FantomQiDaoVaultPositionFetcher,
    // Polygon
    PolygonQiDaoEscrowedQiContractPositionFetcher,
    PolygonQiDaoFarmContractPositionFetcher,
    PolygonQiDaoVaultPositionFetcher,
    PolygonQiDaoYieldTokenFetcher,
    // Gnosis
    GnosisQiDaoVaultPositionFetcher,
    // Arbitrum
    ArbitrumQiDaoVaultPositionFetcher,
    // Optimism
    OptimismQiDaoVaultPositionFetcher,
  ],
})
export class QiDaoAppModule extends AbstractApp() {}
