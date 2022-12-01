import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PieDaoContractFactory } from './contracts';
import { EthereumPieDaoEDoughTokenFetcher } from './ethereum/pie-dao.e-dough.token-fetcher';
import { EthereumPieDaoFarmMasterChefContractPositionFetcher } from './ethereum/pie-dao.farm-master-chef.contract-position-fetcher';
import { EthereumPieDaoFarmSingleStakingContractPositionFetcher } from './ethereum/pie-dao.farm-single-staking.contract-position-fetcher';
import { EthereumPieDaoVeDoughTokenFetcher } from './ethereum/pie-dao.ve-dough.token-fetcher';
import { EthereumPieDaoVotingEscrowContractPositionFether } from './ethereum/pie-dao.voting-escrow.contract-position-fetcher';
import { PieDaoAppDefinition, PIE_DAO_DEFINITION } from './pie-dao.definition';

@Register.AppModule({
  appId: PIE_DAO_DEFINITION.id,
  providers: [
    PieDaoAppDefinition,
    PieDaoContractFactory,
    // Ethereum
    EthereumPieDaoEDoughTokenFetcher,
    EthereumPieDaoFarmSingleStakingContractPositionFetcher,
    EthereumPieDaoFarmMasterChefContractPositionFetcher,
    EthereumPieDaoVeDoughTokenFetcher,
    EthereumPieDaoVotingEscrowContractPositionFether,
  ],
})
export class PieDaoAppModule extends AbstractApp() {}
