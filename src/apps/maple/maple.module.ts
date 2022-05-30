import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { MapleContractFactory } from './contracts';
import { EthereumMapleFarmContractPositionBalanceFetcher } from './ethereum/maple.farm.contract-position-balance-fetcher';
import { EthereumMapleFarmContractPositionFetcher } from './ethereum/maple.farm.contract-position-fetcher';
import { EthereumMaplePoolTokenFetcher } from './ethereum/maple.pool.token-fetcher';
import { EthereumMapleStakedBptTokenFetcher } from './ethereum/maple.staked-bpt.token-fetcher';
import { EthereumMapleXMplTokenFetcher } from './ethereum/maple.x-mpl.token-fetcher';
import { MapleCacheManager } from './helpers/maple.cache-manager';
import { MapleAppDefinition, MAPLE_DEFINITION } from './maple.definition';

@Register.AppModule({
  appId: MAPLE_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    MapleAppDefinition,
    MapleCacheManager,
    MapleContractFactory,
    EthereumMapleFarmContractPositionFetcher,
    EthereumMapleFarmContractPositionBalanceFetcher,
    EthereumMaplePoolTokenFetcher,
    EthereumMapleStakedBptTokenFetcher,
    EthereumMapleXMplTokenFetcher,
  ],
})
export class MapleAppModule extends AbstractApp() {}
