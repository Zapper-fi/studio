import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PhutureContractFactory } from './contracts';
import { EthereumPhutureIndexTokenFetcher } from './ethereum/phuture.index.token-fetcher';
import { PHUTURE_DEFINITION, PhutureAppDefinition } from './phuture.definition';

@Register.AppModule({
  appId: PHUTURE_DEFINITION.id,
  providers: [EthereumPhutureIndexTokenFetcher, PhutureAppDefinition, PhutureContractFactory],
})
export class PhutureAppModule extends AbstractApp() {}
