import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ShapeshiftContractFactory } from './contracts';
import { EthereumShapeshiftFarmContractPositionFetcher } from './ethereum/shapeshift.farm.contract-position-fetcher';

@Module({
  providers: [ShapeshiftContractFactory, EthereumShapeshiftFarmContractPositionFetcher],
})
export class ShapeshiftAppModule extends AbstractApp() {}
