import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PieDaoContractFactory } from './contracts';
import { EthereumPieDaoEDoughTokenFetcher } from './ethereum/pie-dao.e-dough.token-fetcher';
import { EthereumPieDaoFarmMasterChefContractPositionFetcher } from './ethereum/pie-dao.farm-master-chef.contract-position-fetcher';
import { EthereumPieDaoFarmSingleStakingContractPositionFetcher } from './ethereum/pie-dao.farm-single-staking.contract-position-fetcher';
import { EthereumPieDaoVotingEscrowContractPositionFether } from './ethereum/pie-dao.voting-escrow.contract-position-fetcher';
import { PieDaoAppDefinition } from './pie-dao.definition';

@Module({
  providers: [
    PieDaoContractFactory,
    // Ethereum
    EthereumPieDaoEDoughTokenFetcher,
    EthereumPieDaoFarmSingleStakingContractPositionFetcher,
    EthereumPieDaoFarmMasterChefContractPositionFetcher,
    EthereumPieDaoVotingEscrowContractPositionFether,
  ],
})
export class PieDaoAppModule extends AbstractApp() {}
