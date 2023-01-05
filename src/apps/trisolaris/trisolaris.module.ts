import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2';

import { AuroraTrisolarisFarmContractPositionFetcher } from './aurora/trisolaris.farm.contract-position-fetcher';
import { AuroraTrisolarisPoolTokenFetcher } from './aurora/trisolaris.pool.token-fetcher';
import { TrisolarisContractFactory } from './contracts';
import { TrisolarisAppDefinition } from './trisolaris.definition';

@Module({
  providers: [
    TrisolarisAppDefinition,
    TrisolarisContractFactory,
    UniswapV2ContractFactory,
    AuroraTrisolarisFarmContractPositionFetcher,
    AuroraTrisolarisPoolTokenFetcher,
  ],
})
export class TrisolarisAppModule extends AbstractApp() {}
