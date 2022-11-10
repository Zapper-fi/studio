import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ChickenBondAppDefinition, CHICKEN_BOND_DEFINITION } from './chicken-bond.definition';
import { ChickenBondContractFactory } from './contracts';
import { EthereumChickenBondBlusdTokenFetcher } from './ethereum/chicken-bond.blusd.token-fetcher';
import { EthereumChickenBondBondContractPositionFetcher } from './ethereum/chicken-bond.bond.contract-position-fetcher';

@Register.AppModule({
  appId: CHICKEN_BOND_DEFINITION.id,
  providers: [
    ChickenBondAppDefinition,
    ChickenBondContractFactory,
    EthereumChickenBondBlusdTokenFetcher,
    EthereumChickenBondBondContractPositionFetcher,
  ],
})
export class ChickenBondAppModule extends AbstractApp() {}
