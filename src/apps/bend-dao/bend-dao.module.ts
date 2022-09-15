import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BendDaoAppDefinition, BEND_DAO_DEFINITION } from './bend-dao.definition';
import { BendDaoContractFactory } from './contracts';
import { EthereumBendDAODebtTokenFetcher } from './ethereum/bend-dao.debt.token-fetcher';
import { EthereumBendDAOPositionPresenter } from './ethereum/bend-dao.position-presenter';
import { EthereumBendDAOBTokenFetcher } from './ethereum/bend-dao.supply.token-fetcher';

@Register.AppModule({
  appId: BEND_DAO_DEFINITION.id,
  providers: [
    BendDaoAppDefinition,
    BendDaoContractFactory,
    EthereumBendDAODebtTokenFetcher,
    EthereumBendDAOBTokenFetcher,
    EthereumBendDAOPositionPresenter,
  ],
})
export class BendDaoAppModule extends AbstractApp() {}
