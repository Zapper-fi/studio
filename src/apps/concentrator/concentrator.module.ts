import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ConcentratorAppDefinition, CONCENTRATOR_DEFINITION } from './concentrator.definition';
import { ConcentratorContractFactory } from './contracts';
import { EthereumConcentratorAcrvTokenFetcher } from './ethereum/concentrator.acrv.token-fetcher';
import { EthereumConcentratorBalanceFetcher } from './ethereum/concentrator.balance-fetcher';
import { EthereumConcentratorPoolContractPositionFetcher } from './ethereum/concentrator.pool.contract-position-fetcher';

@Register.AppModule({
  appId: CONCENTRATOR_DEFINITION.id,
  providers: [
    ConcentratorAppDefinition,
    ConcentratorContractFactory,
    EthereumConcentratorAcrvTokenFetcher,
    EthereumConcentratorBalanceFetcher,
    EthereumConcentratorPoolContractPositionFetcher,
  ],
})
export class ConcentratorAppModule extends AbstractApp() {}
