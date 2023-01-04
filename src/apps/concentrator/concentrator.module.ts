import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ConcentratorAppDefinition, CONCENTRATOR_DEFINITION } from './concentrator.definition';
import { ConcentratorContractFactory } from './contracts';
import { EthereumConcentratorAcrvTokenFetcher } from './ethereum/concentrator.acrv.token-fetcher';
import { EthereumConcentratorAfrxethTokenFetcher } from './ethereum/concentrator.afrxeth.token-fetcher';
import { EthereumConcentratorAfxsTokenFetcher } from './ethereum/concentrator.afxs.token-fetcher';
import { EthereumConcentratorAcrvVaultContractPositionFetcher } from './ethereum/concentrator.poolacrv.contract-position-fetcher';
import { EthereumConcentratorPoolfrxethContractPositionFetcher } from './ethereum/concentrator.poolfrxeth.contract-position-fetcher';
import { EthereumConcentratorAfxsVaultContractPositionFetcher } from './ethereum/concentrator.poolfxs.contract-position-fetcher';
import { EthereumConcentratorLegacyVaultContractPositionFetcher } from './ethereum/concentrator.poollegacy.contract-position-fetcher';
import { EthereumConcentratorVeContractPositionFetcher } from './ethereum/concentrator.ve.contract-position-fetcher';
import { EthereumConcentratorVestingContractPositionFetcher } from './ethereum/concentrator.vesting.contract-position-fetcher';

@Register.AppModule({
  appId: CONCENTRATOR_DEFINITION.id,
  providers: [
    ConcentratorAppDefinition,
    ConcentratorContractFactory,
    EthereumConcentratorAcrvTokenFetcher,
    EthereumConcentratorAcrvVaultContractPositionFetcher,
    EthereumConcentratorAfrxethTokenFetcher,
    EthereumConcentratorAfxsTokenFetcher,
    EthereumConcentratorAfxsVaultContractPositionFetcher,
    EthereumConcentratorLegacyVaultContractPositionFetcher,
    EthereumConcentratorPoolfrxethContractPositionFetcher,
    EthereumConcentratorVeContractPositionFetcher,
    EthereumConcentratorVestingContractPositionFetcher,
  ],
})
export class ConcentratorAppModule extends AbstractApp() {}
