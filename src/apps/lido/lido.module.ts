import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LidoContractFactory } from './contracts';
import { EthereumLidoStethTokenFetcher } from './ethereum/lido.steth.token-fetcher';
import { EthereumLidoTvlFetcher } from './ethereum/lido.tvl-fetcher';
import { EthereumLidoWstethTokenFetcher } from './ethereum/lido.wsteth.token-fetcher';
import LIDO_DEFINITION, { LidoAppDefinition } from './lido.definition';

@Register.AppModule({
  appId: LIDO_DEFINITION.id,
  providers: [
    LidoAppDefinition,
    LidoContractFactory,
    EthereumLidoTvlFetcher,
    EthereumLidoStethTokenFetcher,
    EthereumLidoWstethTokenFetcher,
  ],
})
export class LidoAppModule extends AbstractApp() {}
