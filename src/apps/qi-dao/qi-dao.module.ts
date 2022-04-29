import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { QiDaoContractFactory } from './contracts';
import { FantomQiDaoBalanceFetcher } from './fantom/qi-dao.balance-fetcher';
import { FantomQiDaoFarmContractPositionFetcher } from './fantom/qi-dao.farm.contract-position-fetcher';
import { FantomQiDaoVaultPositionFetcher } from './fantom/qi-dao.vault.position-fetcher';
import { QiDaoVaultPositionBalanceHelper } from './helpers/qi-dao.vault.position-balance-helper';
import { QiDaoVaultPositionHelper } from './helpers/qi-dao.vault.position-helper';
import { PolygonQiDaoBalanceFetcher } from './polygon/qi-dao.balance-fetcher';
import { PolygonQiDaoEscrowedQiContractPositionFetcher } from './polygon/qi-dao.escrowed-qi.contract-position-fetcher';
import { PolygonQiDaoFarmContractPositionFetcher } from './polygon/qi-dao.farm.contract-position-fetcher';
import { PolygonQiDaoVaultPositionFetcher } from './polygon/qi-dao.vault.contract-position-fetcher';
import { PolygonQiDaoYieldTokenFetcher } from './polygon/qi-dao.yield.token-fetcher';
import { QiDaoAppDefinition } from './qi-dao.definition';

@Module({
  providers: [
    QiDaoAppDefinition,
    QiDaoContractFactory,
    QiDaoVaultPositionHelper,
    QiDaoVaultPositionBalanceHelper,
    FantomQiDaoBalanceFetcher,
    FantomQiDaoFarmContractPositionFetcher,
    FantomQiDaoVaultPositionFetcher,
    PolygonQiDaoBalanceFetcher,
    PolygonQiDaoEscrowedQiContractPositionFetcher,
    PolygonQiDaoFarmContractPositionFetcher,
    PolygonQiDaoVaultPositionFetcher,
    PolygonQiDaoYieldTokenFetcher,
  ],
})
export class QiDaoAppModule extends AbstractApp() {}
