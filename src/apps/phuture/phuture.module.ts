import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePhutureBalanceFetcher } from './avalanche/phuture.balance-fetcher';
import { AvalanchePhutureIndexTokenFetcher } from './avalanche/phuture.index.token-fetcher';
import { PhutureContractFactory } from './contracts';
import { EthereumPhutureBalanceFetcher } from './ethereum/phuture.balance-fetcher';
import { EthereumPhutureIndexTokenFetcher } from './ethereum/phuture.index.token-fetcher';
import { PhutureAppDefinition, PHUTURE_DEFINITION } from './phuture.definition';

@Register.AppModule({
  appId: PHUTURE_DEFINITION.id,
  providers: [
    AvalanchePhutureBalanceFetcher,
    AvalanchePhutureIndexTokenFetcher,
    EthereumPhutureBalanceFetcher,
    EthereumPhutureIndexTokenFetcher,
    PhutureAppDefinition,
    PhutureContractFactory,
  ],
})
export class PhutureAppModule extends AbstractApp() {}
