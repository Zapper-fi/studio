import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ViemContractFactory } from '~apps/uniswap-v2/contracts';

import { MeshswapViemContractFactory } from './contracts';
import { PolygonMeshswapPoolTokenFetcher } from './polygon/meshswap.pool.token-fetcher';
import { PolygonMeshswapSupplyTokenFetcher } from './polygon/meshswap.supply.token-fetcher';

@Module({
  providers: [
    MeshswapViemContractFactory,
    UniswapV2ViemContractFactory,
    PolygonMeshswapPoolTokenFetcher,
    PolygonMeshswapSupplyTokenFetcher,
  ],
})
export class MeshswapAppModule extends AbstractApp() {}
