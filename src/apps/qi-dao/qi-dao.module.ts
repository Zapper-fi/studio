import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { QiDaoContractFactory } from './contracts';
import { FantomQiDaoBalanceFetcher } from './fantom/qi-dao.balance-fetcher';
import { FantomQiDaoFarmContractPositionFetcher } from './fantom/qi-dao.farm.contract-position-fetcher';
import { FantomQiDaoVaultPositionFetcher } from './fantom/qi-dao.vault.position-fetcher';
import { QiDaoVaultPositionBalanceHelper } from './helpers/qi-dao.vault.position-balance-helper';
import { QiDaoVaultPositionHelper } from './helpers/qi-dao.vault.position-helper';
import { PolygonQiDaoAnchorVaultPositionFetcher } from './polygon/qi-dao.anchor-vault.contract-position-fetcher';
import { PolygonQiDaoBalanceFetcher } from './polygon/qi-dao.balance-fetcher';
import { PolygonQiDaoEscrowedQiContractPositionFetcher } from './polygon/qi-dao.escrowed-qi.contract-position-fetcher';
import { PolygonQiDaoFarmContractPositionFetcher } from './polygon/qi-dao.farm.contract-position-fetcher';
import { PolygonQiDaoVaultPositionFetcher } from './polygon/qi-dao.vault.contract-position-fetcher';
import { PolygonQiDaoYieldTokenFetcher } from './polygon/qi-dao.yield.token-fetcher';
import { QiDaoAppDefinition, QI_DAO_DEFINITION } from './qi-dao.definition';

@Register.AppModule({
  appId: QI_DAO_DEFINITION.id,
  providers: [
    QiDaoAppDefinition,
    QiDaoContractFactory,
    QiDaoVaultPositionHelper,
    QiDaoVaultPositionBalanceHelper,
    // Fantom
    FantomQiDaoBalanceFetcher,
    FantomQiDaoFarmContractPositionFetcher,
    FantomQiDaoVaultPositionFetcher,
    // Polygon
    PolygonQiDaoBalanceFetcher,
    PolygonQiDaoEscrowedQiContractPositionFetcher,
    PolygonQiDaoFarmContractPositionFetcher,
    PolygonQiDaoVaultPositionFetcher,
    PolygonQiDaoYieldTokenFetcher,
    PolygonQiDaoAnchorVaultPositionFetcher,
  ],
})
export class QiDaoAppModule extends AbstractApp() {}
