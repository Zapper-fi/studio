import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PhutureContractFactory } from './contracts';
import { EthereumPhutureBalanceFetcher } from './ethereum/phuture.balance-fetcher';
import { EthereumPhutureIndexTokenFetcher } from './ethereum/phuture.index.token-fetcher';
import { PHUTURE_DEFINITION, PhutureAppDefinition } from './phuture.definition';

@Register.AppModule({
  appId: PHUTURE_DEFINITION.id,
  providers: [
    EthereumPhutureBalanceFetcher,
    EthereumPhutureIndexTokenFetcher,
    PhutureAppDefinition,
    PhutureContractFactory,
  ],
})
export class PhutureAppModule extends AbstractApp() {}
