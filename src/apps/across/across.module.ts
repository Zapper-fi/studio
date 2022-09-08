import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AcrossAppDefinition, ACROSS_DEFINITION } from './across.definition';
import { AcrossContractFactory } from './contracts';
import { EthereumAcrossPoolTokenFetcher } from './ethereum/across.pool.token-fetcher';

@Register.AppModule({
  appId: ACROSS_DEFINITION.id,
  providers: [AcrossAppDefinition, AcrossContractFactory, EthereumAcrossPoolTokenFetcher],
})
export class AcrossAppModule extends AbstractApp() {}
