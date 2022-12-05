import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PolygonStakingContractFactory } from './contracts';
import { EthereumPolygonStakingContractPositionFetcher } from './ethereum/polygon-staking.deposit.contract-position-fetcher';
import { PolygonStakingAppDefinition, POLYGON_STAKING_DEFINITION } from './polygon-staking.definition';

@Register.AppModule({
  appId: POLYGON_STAKING_DEFINITION.id,
  providers: [
    PolygonStakingAppDefinition,
    PolygonStakingContractFactory,
    EthereumPolygonStakingContractPositionFetcher,
  ],
})
export class PolygonStakingAppModule extends AbstractApp() {}
