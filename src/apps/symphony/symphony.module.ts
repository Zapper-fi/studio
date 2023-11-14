import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheSymphonyYoloContractPositionFetcher } from './avalanche/symphony.yolo.contract-position-fetcher';
import { SymphonyViemContractFactory } from './contracts';
import { OptimismSymphonyYoloContractPositionFetcher } from './optimism/symphony.yolo.contract-position-fetcher';
import { PolygonSymphonyYoloContractPositionFetcher } from './polygon/symphony.yolo.contract-position-fetcher';

@Module({
  providers: [
    SymphonyViemContractFactory,
    AvalancheSymphonyYoloContractPositionFetcher,
    PolygonSymphonyYoloContractPositionFetcher,
    OptimismSymphonyYoloContractPositionFetcher,
  ],
})
export class SymphonyAppModule extends AbstractApp() {}
