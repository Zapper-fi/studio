import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';

import { MeshswapContractFactory } from './contracts';
import { MeshswapAppDefinition } from './meshswap.definition';
import { PolygonMeshswapPoolTokenFetcher } from './polygon/meshswap.pool.token-fetcher';
import { PolygonMeshswapSupplyTokenFetcher } from './polygon/meshswap.supply.token-fetcher';

@Module({
  providers: [
    MeshswapAppDefinition,
    MeshswapContractFactory,
    UniswapV2ContractFactory,
    PolygonMeshswapPoolTokenFetcher,
    PolygonMeshswapSupplyTokenFetcher,
  ],
})
export class MeshswapAppModule extends AbstractApp() {}
