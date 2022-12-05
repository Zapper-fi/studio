import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory } from '~apps/aave-v2';

import { BendDaoAppDefinition, BEND_DAO_DEFINITION } from './bend-dao.definition';
import { BendDaoContractFactory } from './contracts';
import { EthereumBendDaoPositionPresenter } from './ethereum/bend-dao.position-presenter';
import { EthereumBendDaoSupplyTokenFetcher } from './ethereum/bend-dao.supply.token-fetcher';
import { EthereumBendDaoVariableDebtTokenFetcher } from './ethereum/bend-dao.variable-debt.token-fetcher';

@Register.AppModule({
  appId: BEND_DAO_DEFINITION.id,
  providers: [
    BendDaoAppDefinition,
    BendDaoContractFactory,
    AaveV2ContractFactory,
    EthereumBendDaoVariableDebtTokenFetcher,
    EthereumBendDaoSupplyTokenFetcher,
    EthereumBendDaoPositionPresenter,
  ],
})
export class BendDaoAppModule extends AbstractApp() {}
