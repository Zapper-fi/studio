import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { BalancerV2ContractFactory } from '~apps/balancer-v2';

import { BeethovenXAppDefinition, BEETHOVEN_X_DEFINITION } from './beethoven-x.definition';
import { BeethovenXContractFactory } from './contracts';
import { FantomBeethovenXChefContractPositionFetcher } from './fantom/beethoven-x.chef.contract-position-fetcher';
import { FantomBeethovenXFBeetsTokenFetcher } from './fantom/beethoven-x.f-beets.token-fetcher';
import { FantomBeethovenXPoolTokenFetcher } from './fantom/beethoven-x.pool.token-fetcher';
import { OptimismBeethovenXFarmContractPositionFetcher } from './optimism/beethoven-x.farm.contract-position-fetcher';
import { OptimismBeethovenXPoolTokenFetcher } from './optimism/beethoven-x.pool.token-fetcher';

@Register.AppModule({
  appId: BEETHOVEN_X_DEFINITION.id,
  providers: [
    BeethovenXAppDefinition,
    BeethovenXContractFactory,
    BalancerV2ContractFactory,
    // Fantom
    FantomBeethovenXChefContractPositionFetcher,
    FantomBeethovenXPoolTokenFetcher,
    FantomBeethovenXFBeetsTokenFetcher,
    // Optimism
    OptimismBeethovenXFarmContractPositionFetcher,
    OptimismBeethovenXPoolTokenFetcher,
  ],
})
export class BeethovenXAppModule extends AbstractApp() {}
