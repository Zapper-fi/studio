import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheSymphonyYoloContractPositionFetcher } from './avalanche/symphony.yolo.contract-position-fetcher';
import { SymphonyContractFactory } from './contracts';
import { OptimismSymphonyYoloContractPositionFetcher } from './optimism/symphony.yolo.contract-position-fetcher';
import { PolygonSymphonyYoloContractPositionFetcher } from './polygon/symphony.yolo.contract-position-fetcher';
import { SymphonyAppDefinition } from './symphony.definition';

@Module({
  providers: [
    SymphonyContractFactory,
    AvalancheSymphonyYoloContractPositionFetcher,
    PolygonSymphonyYoloContractPositionFetcher,
    OptimismSymphonyYoloContractPositionFetcher,
  ],
})
export class SymphonyAppModule extends AbstractApp() {}
