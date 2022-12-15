import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { MaplePoolDefinitionResolver } from './common/maple.pool.definition-resolver';
import { MapleContractFactory } from './contracts';
import { EthereumMaplePoolTokenFetcher } from './ethereum/maple.pool.token-fetcher';
import { EthereumMapleXMplTokenFetcher } from './ethereum/maple.x-mpl.token-fetcher';
import { MapleAppDefinition, MAPLE_DEFINITION } from './maple.definition';

@Register.AppModule({
  appId: MAPLE_DEFINITION.id,
  providers: [
    MapleAppDefinition,
    MapleContractFactory,
    MaplePoolDefinitionResolver,
    EthereumMaplePoolTokenFetcher,
    EthereumMapleXMplTokenFetcher,
  ],
})
export class MapleAppModule extends AbstractApp() {}
