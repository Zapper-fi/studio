import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PieDaoViemContractFactory } from './contracts';
import { EthereumPieDaoFarmMasterChefContractPositionFetcher } from './ethereum/pie-dao.farm-master-chef.contract-position-fetcher';
import { EthereumPieDaoFarmSingleStakingContractPositionFetcher } from './ethereum/pie-dao.farm-single-staking.contract-position-fetcher';
import { EthereumPieDaoVotingEscrowContractPositionFether } from './ethereum/pie-dao.voting-escrow.contract-position-fetcher';

@Module({
  providers: [
    PieDaoViemContractFactory,
    // Ethereum
    EthereumPieDaoFarmSingleStakingContractPositionFetcher,
    EthereumPieDaoFarmMasterChefContractPositionFetcher,
    EthereumPieDaoVotingEscrowContractPositionFether,
  ],
})
export class PieDaoAppModule extends AbstractApp() {}
