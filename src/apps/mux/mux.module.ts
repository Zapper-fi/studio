import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { MuxMlpTokenHelper } from '~apps/mux/helpers/mux.mlp.token-helper';

import { ArbitrumMuxMlpTokenFetcher } from './arbitrum/mux.mlp.token-fetcher';
import { AvalancheMuxMlpTokenFetcher } from './avalanche/mux.mlp.token-fetcher';
import { BinanceSmartChainMuxMlpTokenFetcher } from './binance-smart-chain/mux.mlp.token-fetcher';
import { MuxContractFactory } from './contracts';
import { FantomMuxMlpTokenFetcher } from './fantom/mux.mlp.token-fetcher';
import { MuxAppDefinition, MUX_DEFINITION } from './mux.definition';

@Register.AppModule({
  appId: MUX_DEFINITION.id,
  providers: [
    ArbitrumMuxMlpTokenFetcher,
    AvalancheMuxMlpTokenFetcher,
    BinanceSmartChainMuxMlpTokenFetcher,
    FantomMuxMlpTokenFetcher,
    MuxAppDefinition,
    MuxContractFactory,
    MuxMlpTokenHelper,
  ],
})
export class MuxAppModule extends AbstractApp() {}
