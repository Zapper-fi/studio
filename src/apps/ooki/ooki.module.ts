import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { OokiContractFactory } from './contracts';
import { EthereumOokiBalanceFetcher } from './ethereum/ooki.balance-fetcher';
import { EthereumOokiOokiTokenFetcher } from './ethereum/ooki.ooki.token-fetcher';
import { OokiAppDefinition, OOKI_DEFINITION } from './ooki.definition';

@Register.AppModule({
  appId: OOKI_DEFINITION.id,
  providers: [EthereumOokiBalanceFetcher, EthereumOokiOokiTokenFetcher, OokiAppDefinition, OokiContractFactory],
})
export class OokiAppModule extends AbstractApp() {}
