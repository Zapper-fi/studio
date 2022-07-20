import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LidoContractFactory } from './contracts';
import { EthereumLidoStethTokenBalanceFetcher } from './ethereum/lido.steth.token-balance-fetcher';
import { EthereumLidoStethTokenFetcher } from './ethereum/lido.steth.token-fetcher';
import { EthereumLidoWstethTokenBalanceFetcher } from './ethereum/lido.wsteth.token-balance-fetcher';
import { EthereumLidoWstethTokenFetcher } from './ethereum/lido.wsteth.token-fetcher';
import LIDO_DEFINITION, { LidoAppDefinition } from './lido.definition';

@Register.AppModule({
  appId: LIDO_DEFINITION.id,
  providers: [
    LidoAppDefinition,
    LidoContractFactory,
    EthereumLidoStethTokenFetcher,
    EthereumLidoWstethTokenFetcher,
    EthereumLidoStethTokenBalanceFetcher,
    EthereumLidoWstethTokenBalanceFetcher,
  ],
})
export class LidoAppModule extends AbstractApp() {}
