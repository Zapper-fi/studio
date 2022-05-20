import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AcrossAppDefinition, ACROSS_DEFINITION } from './across.definition';
import { AcrossContractFactory } from './contracts';
import { EthereumAcrossTvlFetcher } from './ethereum/across.tvl-fetcher';

@Register.AppModule({
  appId: ACROSS_DEFINITION.id,
  providers: [AcrossAppDefinition, AcrossContractFactory, EthereumAcrossTvlFetcher],
})
export class AcrossAppModule extends AbstractApp() {}
