import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { EaseRcaDefinitionsResolver } from './common/ease.rca-definition-resolver';
import { EaseContractFactory } from './contracts';
import { EaseAppDefinition, EASE_DEFINITION } from './ease.definition';
import { EthereumEaseRcaTokenFetcher } from './ethereum/ease.rca.token-fetcher';

@Register.AppModule({
  appId: EASE_DEFINITION.id,
  providers: [EaseAppDefinition, EaseContractFactory, EaseRcaDefinitionsResolver, EthereumEaseRcaTokenFetcher],
})
export class EaseAppModule extends AbstractApp() {}
