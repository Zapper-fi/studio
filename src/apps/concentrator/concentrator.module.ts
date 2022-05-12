import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ConcentratorAppDefinition, CONCENTRATOR_DEFINITION } from './concentrator.definition';
import { ConcentratorContractFactory } from './contracts';
import { EthereumConcentratorBalanceFetcher } from './ethereum/concentrator.balance-fetcher';
import { EthereumConcentratorConcentratorTokenFetcher } from './ethereum/concentrator.concentrator.token-fetcher';
import { EthereumConcentratorConcentratorTokenFetcher } from './ethereum/concentrator.concentrator.token-fetcher';

@Register.AppModule({
  appId: CONCENTRATOR_DEFINITION.id,
  providers: [
    ConcentratorAppDefinition,
    ConcentratorContractFactory,
    EthereumConcentratorBalanceFetcher,
    EthereumConcentratorConcentratorTokenFetcher,
    EthereumConcentratorConcentratorTokenFetcher,
  ],
})
export class ConcentratorAppModule extends AbstractApp() {}
