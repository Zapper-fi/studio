import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2';

import { KyberDmmContractFactory } from './contracts';
import { EthereumKyberDmmFarmContractPositionFetcher } from './ethereum/kyber-dmm.farm.contract-position-fetcher';
import { EthereumKyberDmmPoolTokenFetcher } from './ethereum/kyber-dmm.pool.token-fetcher';
import { KyberDmmAppDefinition, KYBER_DMM_DEFINITION } from './kyber-dmm.definition';
import { PolygonKyberDmmFarmContractPositionFetcher } from './polygon/kyber-dmm.farm.contract-position-fetcher';
import { PolygonKyberDmmLegacyFarmContractPositionFetcher } from './polygon/kyber-dmm.legacy-farm.contract-position-fetcher';
import { PolygonKyberDmmPoolTokenFetcher } from './polygon/kyber-dmm.pool.token-fetcher';

@Register.AppModule({
  appId: KYBER_DMM_DEFINITION.id,
  providers: [
    KyberDmmAppDefinition,
    KyberDmmContractFactory,
    UniswapV2ContractFactory,
    EthereumKyberDmmPoolTokenFetcher,
    EthereumKyberDmmFarmContractPositionFetcher,
    PolygonKyberDmmPoolTokenFetcher,
    PolygonKyberDmmFarmContractPositionFetcher,
    PolygonKyberDmmLegacyFarmContractPositionFetcher,
  ],
})
export class KyberDmmAppModule extends AbstractApp() {}
