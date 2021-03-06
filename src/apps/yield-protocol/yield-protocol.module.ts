import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumYieldProtocolBalanceFetcher } from './arbitrum/yield-protocol.balance-fetcher';
import { ArbitrumYieldProtocolBorrowContractPositionFetcher } from './arbitrum/yield-protocol.borrow.contract-position-fetcher';
import { ArbitrumYieldProtocolLendTokenFetcher } from './arbitrum/yield-protocol.lend.token-fetcher';
import { ArbitrumYieldProtocolPoolTokenFetcher } from './arbitrum/yield-protocol.pool.token-fetcher';
import { YieldProtocolContractFactory } from './contracts';
import { EthereumYieldProtocolBalanceFetcher } from './ethereum/yield-protocol.balance-fetcher';
import { EthereumYieldProtocolBorrowContractPositionFetcher } from './ethereum/yield-protocol.borrow.contract-position-fetcher';
import { EthereumYieldProtocolLendTokenFetcher } from './ethereum/yield-protocol.lend.token-fetcher';
import { EthereumYieldProtocolPoolTokenFetcher } from './ethereum/yield-protocol.pool.token-fetcher';
import { YieldProtocolAppDefinition, YIELD_PROTOCOL_DEFINITION } from './yield-protocol.definition';

@Register.AppModule({
  appId: YIELD_PROTOCOL_DEFINITION.id,
  providers: [
    ArbitrumYieldProtocolBalanceFetcher,
    ArbitrumYieldProtocolBorrowContractPositionFetcher,
    ArbitrumYieldProtocolLendTokenFetcher,
    ArbitrumYieldProtocolPoolTokenFetcher,
    EthereumYieldProtocolBalanceFetcher,
    EthereumYieldProtocolBorrowContractPositionFetcher,
    EthereumYieldProtocolLendTokenFetcher,
    EthereumYieldProtocolPoolTokenFetcher,
    YieldProtocolAppDefinition,
    YieldProtocolContractFactory,
  ],
})
export class YieldProtocolAppModule extends AbstractApp() {}
