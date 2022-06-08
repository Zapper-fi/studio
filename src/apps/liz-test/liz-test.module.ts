import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LizTestContractFactory } from './contracts';
import { EthereumLizTestBalanceFetcher } from './ethereum/liz-test.balance-fetcher';
import { EthereumLizTestFarmContractPositionFetcher } from './ethereum/liz-test.farm.contract-position-fetcher';
import { EthereumLizTestJarTokenFetcher } from './ethereum/liz-test.jar.token-fetcher';
import { EthereumLizTestTvlFetcher } from './ethereum/liz-test.tvl-fetcher';
import { LizTestAppDefinition, LIZ_TEST_DEFINITION } from './liz-test.definition';

@Register.AppModule({
  appId: LIZ_TEST_DEFINITION.id,
  providers: [
    EthereumLizTestBalanceFetcher,
    EthereumLizTestFarmContractPositionFetcher,
    EthereumLizTestJarTokenFetcher,
    EthereumLizTestTvlFetcher,
    LizTestAppDefinition,
    LizTestContractFactory,
  ],
})
export class LizTestAppModule extends AbstractApp() {}
