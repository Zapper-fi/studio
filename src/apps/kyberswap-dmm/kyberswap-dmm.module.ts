import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2';

import { KyberswapDmmContractFactory } from './contracts';
import { EthereumKyberSwapDmmFarmContractPositionFetcher } from './ethereum/kyberswap-dmm.farm.contract-position-fetcher';
import { EthereumKyberSwapDmmPoolTokenFetcher } from './ethereum/kyberswap-dmm.pool.token-fetcher';
import { KyberSwapDmmAppDefinition, KYBERSWAP_DMM_DEFINITION } from './kyberswap-dmm.definition';
import { PolygonKyberSwapDmmFarmContractPositionFetcher } from './polygon/kyberswap-dmm.farm.contract-position-fetcher';
import { PolygonKyberSwapDmmLegacyFarmContractPositionFetcher } from './polygon/kyberswap-dmm.legacy-farm.contract-position-fetcher';
import { PolygonKyberSwapDmmPoolTokenFetcher } from './polygon/kyberswap-dmm.pool.token-fetcher';

@Register.AppModule({
  appId: KYBERSWAP_DMM_DEFINITION.id,
  providers: [
    KyberSwapDmmAppDefinition,
    KyberswapDmmContractFactory,
    UniswapV2ContractFactory,
    EthereumKyberSwapDmmPoolTokenFetcher,
    EthereumKyberSwapDmmFarmContractPositionFetcher,
    PolygonKyberSwapDmmPoolTokenFetcher,
    PolygonKyberSwapDmmFarmContractPositionFetcher,
    PolygonKyberSwapDmmLegacyFarmContractPositionFetcher,
  ],
})
export class KyberSwapDmmAppModule extends AbstractApp() { }
