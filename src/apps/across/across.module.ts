import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AcrossAppDefinition, ACROSS_DEFINITION } from './across.definition';
import { AcrossContractFactory } from './contracts';
import { EthereumAcrossV1PoolTokenFetcher } from './ethereum/across.v1-pool.token-fetcher';

@Register.AppModule({
  appId: ACROSS_DEFINITION.id,
  providers: [AcrossAppDefinition, AcrossContractFactory, EthereumAcrossV1PoolTokenFetcher],
})
export class AcrossAppModule extends AbstractApp() {}
