import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { OriginStoryContractFactory } from './contracts';
import { EthereumOriginStorySeriesContractPositionFetcher } from './ethereum/origin-story.series.contract-position-fetcher';

@Module({
  providers: [OriginStoryContractFactory, EthereumOriginStorySeriesContractPositionFetcher],
})
export class OriginStoryAppModule extends AbstractApp() {}
