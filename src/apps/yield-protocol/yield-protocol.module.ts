import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumYieldProtocolBorrowContractPositionFetcher } from './arbitrum/yield-protocol.borrow.contract-position-fetcher';
import { ArbitrumYieldProtocolLendTokenFetcher } from './arbitrum/yield-protocol.lend.token-fetcher';
import { ArbitrumYieldProtocolPoolTokenFetcher } from './arbitrum/yield-protocol.pool.token-fetcher';
import { YieldProtocolContractFactory } from './contracts';
import { EthereumYieldProtocolBorrowContractPositionFetcher } from './ethereum/yield-protocol.borrow.contract-position-fetcher';
import { EthereumYieldProtocolLendTokenFetcher } from './ethereum/yield-protocol.lend.token-fetcher';
import { EthereumYieldProtocolPoolTokenFetcher } from './ethereum/yield-protocol.pool.token-fetcher';
import { YieldProtocolAppDefinition } from './yield-protocol.definition';

@Module({
  providers: [
    YieldProtocolContractFactory,
    ArbitrumYieldProtocolBorrowContractPositionFetcher,
    ArbitrumYieldProtocolLendTokenFetcher,
    ArbitrumYieldProtocolPoolTokenFetcher,
    EthereumYieldProtocolBorrowContractPositionFetcher,
    EthereumYieldProtocolLendTokenFetcher,
    EthereumYieldProtocolPoolTokenFetcher,
  ],
})
export class YieldProtocolAppModule extends AbstractApp() {}
