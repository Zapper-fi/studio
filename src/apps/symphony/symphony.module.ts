import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheSymphonyYoloContractPositionFetcher } from './avalanche/symphony.yolo.contract-position-fetcher';
import { SymphonyContractFactory } from './contracts';
import { OptimismSymphonyYoloContractPositionFetcher } from './optimism/symphony.yolo.contract-position-fetcher';
import { PolygonSymphonyYoloContractPositionFetcher } from './polygon/symphony.yolo.contract-position-fetcher';
import { SymphonyAppDefinition, SYMPHONY_DEFINITION } from './symphony.definition';

@Register.AppModule({
  appId: SYMPHONY_DEFINITION.id,
  providers: [
    SymphonyAppDefinition,
    SymphonyContractFactory,
    AvalancheSymphonyYoloContractPositionFetcher,
    PolygonSymphonyYoloContractPositionFetcher,
    OptimismSymphonyYoloContractPositionFetcher,
  ],
})
export class SymphonyAppModule extends AbstractApp() {}
