import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { RaftContractFactory } from './contracts';
import { EthereumRaftPositionPresenter } from './ethereum/raft.position-presenter';
import { EthereumRaftWstethCollateralTokenFetcher } from './ethereum/raft.wsteth-collateral.token-fetcher';
import { EthereumRaftWstethDebtTokenFetcher } from './ethereum/raft.wsteth-debt.token-fetcher';
import { EthereumRaftWstethContractPositionFetcher } from './ethereum/raft.wsteth.contract-position-fetcher';

@Module({
  providers: [
    RaftContractFactory,
    EthereumRaftWstethCollateralTokenFetcher,
    EthereumRaftWstethDebtTokenFetcher,
    EthereumRaftWstethContractPositionFetcher,
    EthereumRaftPositionPresenter,
  ],
})
export class RaftAppModule extends AbstractApp() {}
