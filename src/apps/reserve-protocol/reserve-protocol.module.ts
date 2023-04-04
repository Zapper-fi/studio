import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ReserveProtocolContractFactory } from './contracts';
import { EthereumReserveProtocolStakedRsrTokenFetcher } from './ethereum/reserve-protocol.staked-rsr.token-fetcher';
import { EthereumReserveProtocolCooldownContractPositionFetcher } from './ethereum/reserve-protocol.cooldown.contract-position-fetcher';

@Module({
  providers: [
    EthereumReserveProtocolStakedRsrTokenFetcher,
    EthereumReserveProtocolCooldownContractPositionFetcher,
    ReserveProtocolContractFactory,
  ],
})
export class ReserveProtocolAppModule extends AbstractApp() {}
