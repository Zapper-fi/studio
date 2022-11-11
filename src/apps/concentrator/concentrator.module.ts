import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ConcentratorAppDefinition, CONCENTRATOR_DEFINITION } from './concentrator.definition';
import { ConcentratorContractFactory } from './contracts';
import { EthereumConcentratorAcrvTokenFetcher } from './ethereum/concentrator.acrv.token-fetcher';
import { EthereumConcentratorIfoContractPositionFetcher } from './ethereum/concentrator.ifo.contract-position-fetcher';
import { EthereumConcentratorPoolContractPositionFetcher } from './ethereum/concentrator.pool.contract-position-fetcher';
import { EthereumConcentratorVeContractPositionFetcher } from './ethereum/concentrator.ve.contract-position-fetcher';

@Register.AppModule({
  appId: CONCENTRATOR_DEFINITION.id,
  providers: [
    ConcentratorAppDefinition,
    ConcentratorContractFactory,
    EthereumConcentratorAcrvTokenFetcher,
    EthereumConcentratorIfoContractPositionFetcher,
    EthereumConcentratorPoolContractPositionFetcher,
    EthereumConcentratorVeContractPositionFetcher,
  ],
})
export class ConcentratorAppModule extends AbstractApp() {}
