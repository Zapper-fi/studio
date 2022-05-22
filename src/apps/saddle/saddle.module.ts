import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { SaddleContractFactory } from './contracts';
import { EthereumSaddlePoolTokenFetcher } from './ethereum/Saddle.pool.token-fetcher';
import { SaddleAppDefinition, SADDLE_DEFINITION } from './saddle.definition';

@Register.AppModule({
  appId: SADDLE_DEFINITION.id,
  providers: [EthereumSaddlePoolTokenFetcher, SaddleAppDefinition, SaddleContractFactory],
})
export class SaddleAppModule extends AbstractApp() {}
