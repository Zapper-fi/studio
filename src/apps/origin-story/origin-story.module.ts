import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { OriginStoryContractFactory } from './contracts';
import { EthereumOriginStorySeriesContractPositionFetcher } from './ethereum/origin-story.series.contract-position-fetcher';
import { OriginStoryAppDefinition } from './origin-story.definition';

@Module({
  providers: [OriginStoryAppDefinition, OriginStoryContractFactory, EthereumOriginStorySeriesContractPositionFetcher],
})
export class OriginStoryAppModule extends AbstractApp() {}
