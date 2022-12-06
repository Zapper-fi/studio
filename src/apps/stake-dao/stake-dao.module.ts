import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { StakeDaoContractFactory } from './contracts';
import { EthereumStakeDaoFarmContractPositionFetcher } from './ethereum/stake-dao.farm.contract-position-fetcher';
import { EthereumStakeDaoGaugeContractPositionFetcher } from './ethereum/stake-dao.gauge.contract-position-fetcher';
import { EthereumStakeDaoLockerTokenFetcher } from './ethereum/stake-dao.locker.token-fetcher';
import { EthereumStakeDaoEscrowedQiContractPositionFetcher } from './ethereum/stake-dao.voting-escrow.contract-position-fetcher';
import { StakeDaoAppDefinition, STAKE_DAO_DEFINITION } from './stake-dao.definition';

@Register.AppModule({
  appId: STAKE_DAO_DEFINITION.id,
  providers: [
    StakeDaoAppDefinition,
    StakeDaoContractFactory,
    EthereumStakeDaoLockerTokenFetcher,
    EthereumStakeDaoGaugeContractPositionFetcher,
    EthereumStakeDaoFarmContractPositionFetcher,
    EthereumStakeDaoEscrowedQiContractPositionFetcher,
  ],
})
export class StakeDaoAppModule extends AbstractApp() {}
