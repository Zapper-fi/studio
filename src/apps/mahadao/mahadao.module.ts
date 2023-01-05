import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { CurveVotingEscrowContractPositionBalanceHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-balance-helper';
import { CurveVotingEscrowContractPositionHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-helper';

import { MahadaoContractFactory } from './contracts';
import { EthereumMahadaoLockerContractPositionFetcher } from './ethereum/mahadao.locker.contract-position-fetcher';
import { MahadaoAppDefinition } from './mahadao.definition';

@Module({
  providers: [
    MahadaoAppDefinition,
    MahadaoContractFactory,
    CurveVotingEscrowContractPositionBalanceHelper,
    CurveVotingEscrowContractPositionHelper,
    EthereumMahadaoLockerContractPositionFetcher,
  ],
})
export class MahadaoAppModule extends AbstractApp() {}
