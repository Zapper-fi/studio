import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ShapeshiftViemContractFactory } from './contracts';
import { EthereumShapeshiftFarmContractPositionFetcher } from './ethereum/shapeshift.farm.contract-position-fetcher';

@Module({
  providers: [ShapeshiftViemContractFactory, EthereumShapeshiftFarmContractPositionFetcher],
})
export class ShapeshiftAppModule extends AbstractApp() {}
