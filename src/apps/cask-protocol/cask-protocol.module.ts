import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumCaskProtocolWalletTokenFetcher } from './arbitrum/cask-protocol.wallet.token-fetcher';
import { AvalancheCaskProtocolWalletTokenFetcher } from './avalanche/cask-protocol.wallet.token-fetcher';
import { BinanceSmartChainCaskProtocolWalletTokenFetcher } from './binance-smart-chain/cask-protocol.wallet.token-fetcher';
import { CeloCaskProtocolWalletTokenFetcher } from './celo/cask-protocol.wallet.token-fetcher';
import { CaskProtocolViemContractFactory } from './contracts';
import { FantomCaskProtocolWalletTokenFetcher } from './fantom/cask-protocol.wallet.token-fetcher';
import { GnosisCaskProtocolWalletTokenFetcher } from './gnosis/cask-protocol.wallet.token-fetcher';
import { OptimismCaskProtocolWalletTokenFetcher } from './optimism/cask-protocol.wallet.token-fetcher';
import { PolygonCaskProtocolWalletTokenFetcher } from './polygon/cask-protocol.wallet.token-fetcher';

@Module({
  providers: [
    CaskProtocolContractFactory,
    ArbitrumCaskProtocolWalletTokenFetcher,
    AvalancheCaskProtocolWalletTokenFetcher,
    BinanceSmartChainCaskProtocolWalletTokenFetcher,
    CeloCaskProtocolWalletTokenFetcher,
    FantomCaskProtocolWalletTokenFetcher,
    GnosisCaskProtocolWalletTokenFetcher,
    OptimismCaskProtocolWalletTokenFetcher,
    PolygonCaskProtocolWalletTokenFetcher,
  ],
})
export class CaskProtocolAppModule extends AbstractApp() {}
