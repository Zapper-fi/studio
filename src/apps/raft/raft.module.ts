import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { RaftViemContractFactory } from './contracts';
import { EthereumRaftCollateralV1TokenFetcher } from './ethereum/raft.collateral-v1.token-fetcher';
import { EthereumRaftCollateralV2TokenFetcher } from './ethereum/raft.collateral-v2.token-fetcher';
import { EthereumRaftDebtV1TokenFetcher } from './ethereum/raft.debt-v1.token-fetcher';
import { EthereumRaftDebtV2TokenFetcher } from './ethereum/raft.debt-v2.token-fetcher';
import { EthereumRaftPositionPresenter } from './ethereum/raft.position-presenter';
import { EthereumRaftPositionV1ContractPositionFetcher } from './ethereum/raft.position-v1.contract-position-fetcher';
import { EthereumRaftPositionV2ContractPositionFetcher } from './ethereum/raft.position-v2.contract-position-fetcher';

@Module({
  providers: [
    RaftViemContractFactory,
    EthereumRaftCollateralV1TokenFetcher,
    EthereumRaftCollateralV2TokenFetcher,
    EthereumRaftDebtV1TokenFetcher,
    EthereumRaftDebtV2TokenFetcher,
    EthereumRaftPositionV1ContractPositionFetcher,
    EthereumRaftPositionV2ContractPositionFetcher,
    EthereumRaftPositionPresenter,
  ],
})
export class RaftAppModule extends AbstractApp() {}
