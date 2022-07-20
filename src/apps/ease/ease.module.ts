import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { EaseContractFactory } from './contracts';
import { EaseAppDefinition, EASE_DEFINITION } from './ease.definition';
import { EthereumEaseBalanceFetcher } from './ethereum/ease.balance-fetcher';
import { EthereumEaseRcaTokenFetcher } from './ethereum/ease.rca.token-fetcher';

@Register.AppModule({
  appId: EASE_DEFINITION.id,
  providers: [EaseAppDefinition, EaseContractFactory, EthereumEaseBalanceFetcher, EthereumEaseRcaTokenFetcher],
})
export class EaseAppModule extends AbstractApp() {}
