import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LlamapayStreamApiClient } from './common/llamapay.stream.api-client';
import { LlamapayContractFactory } from './contracts';
import { EthereumLlamapayBalanceFetcher } from './ethereum/llamapay.balance-fetcher';
import { LlamapayAppDefinition, LLAMAPAY_DEFINITION } from './llamapay.definition';

@Register.AppModule({
  appId: LLAMAPAY_DEFINITION.id,
  providers: [EthereumLlamapayBalanceFetcher, LlamapayAppDefinition, LlamapayContractFactory, LlamapayStreamApiClient],
})
export class LlamapayAppModule extends AbstractApp() {}
