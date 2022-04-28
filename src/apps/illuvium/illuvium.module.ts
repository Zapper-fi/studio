import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { IlluviumContractFactory } from './contracts';
import { EthereumIlluviumBalanceFetcher } from './ethereum/illuvium.balance-fetcher';
import { EthereumIlluviumFarmV2ContractPositionFetcher } from './ethereum/illuvium.farm-v2.contract-position-fetcher';
import { EthereumIlluviumFarmContractPositionFetcher } from './ethereum/illuvium.farm.contract-position-fetcher';
import { EthereumIlluviumMigrationManager } from './ethereum/illuvium.migration-manager';
import { IlluviumAppDefinition, ILLUVIUM_DEFINITION } from './illuvium.definition';

@Register.AppModule({
  appId: ILLUVIUM_DEFINITION.id,
  providers: [
    IlluviumAppDefinition,
    IlluviumContractFactory,
    EthereumIlluviumFarmContractPositionFetcher,
    EthereumIlluviumFarmV2ContractPositionFetcher,
    EthereumIlluviumBalanceFetcher,
    EthereumIlluviumMigrationManager,
  ],
})
export class IlluviumAppModule extends AbstractApp() {}
