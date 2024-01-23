import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { LooksRareViemContractFactory } from './contracts';
import { EthereumLooksRareCompounderContractPositionFetcher } from './ethereum/looks-rare.compounder.contract-position-fetcher';
import { EthereumLooksRareStakingPoolContractPositionFetcher } from './ethereum/looks-rare.staking-pool.contract-position-fetcher';
import { EthereumLooksRareStakingV1ContractPositionFetcher } from './ethereum/looks-rare.staking-v1.contract-position-fetcher';
import { EthereumLooksRareStakingV2ContractPositionFetcher } from './ethereum/looks-rare.staking-v2.contract-position-fetcher';

@Module({
  providers: [
    LooksRareViemContractFactory,
    EthereumLooksRareStakingV1ContractPositionFetcher,
    EthereumLooksRareCompounderContractPositionFetcher,
    EthereumLooksRareStakingV2ContractPositionFetcher,
    EthereumLooksRareStakingPoolContractPositionFetcher,
  ],
})
export class LooksRareAppModule extends AbstractApp() {}
