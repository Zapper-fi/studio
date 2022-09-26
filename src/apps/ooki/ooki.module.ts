import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { OokiContractFactory } from './contracts';
import { EthereumOokiOokiTokenFetcher } from './ethereum/ooki.lend.token-fetcher';
import { OokiAppDefinition, OOKI_DEFINITION } from './ooki.definition';

@Register.AppModule({
  appId: OOKI_DEFINITION.id,
  providers: [EthereumOokiOokiTokenFetcher, OokiAppDefinition, OokiContractFactory],
})
export class OokiAppModule extends AbstractApp() {}
