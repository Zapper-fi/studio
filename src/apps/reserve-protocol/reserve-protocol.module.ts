import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ReserveProtocolContractFactory } from './contracts';
import { EthereumReserveProtocolCooldownContractPositionFetcher } from './ethereum/reserve-protocol.cooldown.contract-position-fetcher';
import { EthereumReserveProtocolStakedRsrTokenFetcher } from './ethereum/reserve-protocol.staked-rsr.token-fetcher';

@Module({
  providers: [
    EthereumReserveProtocolStakedRsrTokenFetcher,
    EthereumReserveProtocolCooldownContractPositionFetcher,
    ReserveProtocolContractFactory,
  ],
})
export class ReserveProtocolAppModule extends AbstractApp() {}
