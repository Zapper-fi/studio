import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { UnagiiContractFactory } from './contracts';
import { EthereumUnagiiBalanceFetcher } from './ethereum/unagii.balance-fetcher';
import { EthereumUnagiiPoolTokenFetcher } from './ethereum/unagii.pool.token-fetcher';
import UNAGII_DEFINITION, { UnagiiAppDefinition } from './unagii.definition';

@Register.AppModule({
  appId: UNAGII_DEFINITION.id,
  providers: [UnagiiAppDefinition, UnagiiContractFactory, EthereumUnagiiPoolTokenFetcher, EthereumUnagiiBalanceFetcher],
})
export class UnagiiAppModule extends AbstractApp() {}
