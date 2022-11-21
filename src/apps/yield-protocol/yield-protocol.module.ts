import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumYieldProtocolBorrowContractPositionFetcher } from './arbitrum/yield-protocol.borrow.contract-position-fetcher';
import { ArbitrumYieldProtocolLendTokenFetcher } from './arbitrum/yield-protocol.lend.token-fetcher';
import { ArbitrumYieldProtocolPoolTokenFetcher } from './arbitrum/yield-protocol.pool.token-fetcher';
import { YieldProtocolContractFactory } from './contracts';
import { EthereumYieldProtocolBorrowContractPositionFetcher } from './ethereum/yield-protocol.borrow.contract-position-fetcher';
import { EthereumYieldProtocolLendTokenFetcher } from './ethereum/yield-protocol.lend.token-fetcher';
import { EthereumYieldProtocolPoolTokenFetcher } from './ethereum/yield-protocol.pool.token-fetcher';
import { YieldProtocolAppDefinition, YIELD_PROTOCOL_DEFINITION } from './yield-protocol.definition';

@Register.AppModule({
  appId: YIELD_PROTOCOL_DEFINITION.id,
  providers: [
    YieldProtocolAppDefinition,
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
