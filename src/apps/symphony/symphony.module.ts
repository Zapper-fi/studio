import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheSymphonyBalanceFetcher } from './avalanche/symphony.balance-fetcher';
import { AvalancheSymphonyYoloContractPositionFetcher } from './avalanche/symphony.yolo.contract-position-fetcher';
import { SymphonyContractFactory } from './contracts';
import { OptimismSymphonyBalanceFetcher } from './optimism/symphony.balance-fetcher';
import { OptimismSymphonyYoloContractPositionFetcher } from './optimism/symphony.yolo.contract-position-fetcher';
import { PolygonSymphonyBalanceFetcher } from './polygon/symphony.balance-fetcher';
import { PolygonSymphonyYoloContractPositionFetcher } from './polygon/symphony.yolo.contract-position-fetcher';
import { SymphonyAppDefinition, SYMPHONY_DEFINITION } from './symphony.definition';

@Register.AppModule({
  appId: SYMPHONY_DEFINITION.id,
  providers: [
    SymphonyAppDefinition,
    SymphonyContractFactory,
    // Avalanche
    AvalancheSymphonyBalanceFetcher,
    AvalancheSymphonyYoloContractPositionFetcher,
    // Polygon
    PolygonSymphonyBalanceFetcher,
    PolygonSymphonyYoloContractPositionFetcher,
    // Optimism
    OptimismSymphonyBalanceFetcher,
    OptimismSymphonyYoloContractPositionFetcher,
  ],
})
export class SymphonyAppModule extends AbstractApp() {}
