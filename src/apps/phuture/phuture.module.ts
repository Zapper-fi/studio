import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePhutureIndexTokenFetcher } from './avalanche/phuture.index.token-fetcher';
import { PhutureContractFactory } from './contracts';
import { EthereumPhutureIndexTokenFetcher } from './ethereum/phuture.index.token-fetcher';
import { PhutureAppDefinition, PHUTURE_DEFINITION } from './phuture.definition';

@Register.AppModule({
  appId: PHUTURE_DEFINITION.id,
  providers: [
    PhutureAppDefinition,
    PhutureContractFactory,
    // Avalanche
    AvalanchePhutureIndexTokenFetcher,
    // Ethereum
    EthereumPhutureIndexTokenFetcher,
  ],
})
export class PhutureAppModule extends AbstractApp() {}
