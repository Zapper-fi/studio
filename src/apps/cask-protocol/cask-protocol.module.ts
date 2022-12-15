import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumCaskProtocolWalletTokenFetcher } from './arbitrum/cask-protocol.wallet.token-fetcher';
import { AuroraCaskProtocolWalletTokenFetcher } from './aurora/cask-protocol.wallet.token-fetcher';
import { AvalancheCaskProtocolWalletTokenFetcher } from './avalanche/cask-protocol.wallet.token-fetcher';
import { BNBChainCaskProtocolWalletTokenFetcher } from './binance-smart-chain/cask-protocol.wallet.token-fetcher';
import { CeloCaskProtocolWalletTokenFetcher } from './celo/cask-protocol.wallet.token-fetcher';
import { FantomCaskProtocolWalletTokenFetcher } from './fantom/cask-protocol.wallet.token-fetcher';
import { GnosisCaskProtocolWalletTokenFetcher } from './gnosis/cask-protocol.wallet.token-fetcher';
import { OptimismCaskProtocolWalletTokenFetcher } from './optimism/cask-protocol.wallet.token-fetcher';
import { PolygonCaskProtocolWalletTokenFetcher } from './polygon/cask-protocol.wallet.token-fetcher';

import { CaskProtocolAppDefinition, CASK_PROTOCOL_DEFINITION } from './cask-protocol.definition';
import { CaskProtocolContractFactory } from './contracts';

@Register.AppModule({
  appId: CASK_PROTOCOL_DEFINITION.id,
  providers: [
      ArbitrumCaskProtocolWalletTokenFetcher,
      AuroraCaskProtocolWalletTokenFetcher,
      AvalancheCaskProtocolWalletTokenFetcher,
      BNBChainCaskProtocolWalletTokenFetcher,
      CeloCaskProtocolWalletTokenFetcher,
      FantomCaskProtocolWalletTokenFetcher,
      GnosisCaskProtocolWalletTokenFetcher,
      OptimismCaskProtocolWalletTokenFetcher,
      PolygonCaskProtocolWalletTokenFetcher,

      CaskProtocolAppDefinition,
      CaskProtocolContractFactory
  ],
})
export class CaskProtocolAppModule extends AbstractApp() {}
