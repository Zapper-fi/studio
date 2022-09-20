import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PolygonContractFactory } from './contracts';
import { EthereumPolygonBalanceFetcher } from './ethereum/polygon.balance-fetcher';
import { EthereumPolygonStakingContractPositionFetcher } from './ethereum/polygon.staking.contract-position-fetcher';
import { PolygonAppDefinition, POLYGON_DEFINITION } from './polygon.definition';

@Register.AppModule({
  appId: POLYGON_DEFINITION.id,
  providers: [
    PolygonAppDefinition,
    PolygonContractFactory,
    EthereumPolygonStakingContractPositionFetcher,
    EthereumPolygonBalanceFetcher,
  ],
})
export class PolygonAppModule extends AbstractApp() {}
