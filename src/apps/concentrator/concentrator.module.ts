import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ConcentratorAppDefinition, CONCENTRATOR_DEFINITION } from './concentrator.definition';
import { ConcentratorContractFactory } from './contracts';
import { EthereumConcentratorAcrvTokenFetcher } from './ethereum/concentrator.acrv.token-fetcher';
import { EthereumConcentratorAcrvVaultContractPositionFetcher } from './ethereum/concentrator.acrv-vault.contract-position-fetcher';
import { EthereumConcentratorLegacyVaultContractPositionFetcher } from './ethereum/concentrator.legacy-vault.contract-position-fetcher';
import { EthereumConcentratorVeContractPositionFetcher } from './ethereum/concentrator.ve.contract-position-fetcher';

@Register.AppModule({
  appId: CONCENTRATOR_DEFINITION.id,
  providers: [
    ConcentratorAppDefinition,
    ConcentratorContractFactory,
    EthereumConcentratorAcrvTokenFetcher,
    EthereumConcentratorAcrvVaultContractPositionFetcher,
    EthereumConcentratorLegacyVaultContractPositionFetcher,
    EthereumConcentratorVeContractPositionFetcher,
  ],
})
export class ConcentratorAppModule extends AbstractApp() { }
