import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { OlympusAppModule } from '~apps/olympus';

import { HectorDaoContractFactory } from './contracts';
import { FantomHectorDaoBalanceFetcher } from './fantom/hector-dao.balance-fetcher';
import { FantomHectorDaoBondContractPositionFetcher } from './fantom/hector-dao.bond.contract-position-fetcher';
import { FantomHectorDaoStakeBondContractPositionFetcher } from './fantom/hector-dao.stake-bond.contract-position-fetcher';
import { FantomHectorDaoVaultTokenFetcher } from './fantom/hector-dao.vault.token-fetcher';
import { HectorDaoAppDefinition, HECTOR_DAO_DEFINITION } from './hector-dao.definition';

Register.AppModule({
  appId: HECTOR_DAO_DEFINITION.id,
  imports: [OlympusAppModule],
  providers: [
    HectorDaoAppDefinition,
    HectorDaoContractFactory,
    FantomHectorDaoVaultTokenFetcher,
    FantomHectorDaoBondContractPositionFetcher,
    FantomHectorDaoStakeBondContractPositionFetcher,
    FantomHectorDaoBalanceFetcher,
  ],
});
export class HectorDaoAppModule extends AbstractApp() {}
