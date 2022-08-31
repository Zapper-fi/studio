import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import {
  CurvePoolOnChainCoinStrategy,
  CurvePoolOnChainReserveStrategy,
  CurvePoolTokenHelper,
  CurvePoolVirtualPriceStrategy,
} from '~apps/curve';
import { SynthetixAppModule } from '~apps/synthetix';

import { SaddleContractFactory } from './contracts';
import { EthereumSaddleBalanceFetcher } from './ethereum/saddle.balance-fetcher';
import { EthereumSaddleCommunalFarmContractPositionFetcher } from './ethereum/saddle.communal-farm.contract-position-fetcher';
import { EthereumSaddleMiniChefV2FarmContractPositionFetcher } from './ethereum/saddle.mini-chef-v2-farm.contract-position-fetcher';
import { EthereumSaddlePoolTokenFetcher } from './ethereum/saddle.pool.token-fetcher';
import { EvmosSaddleBalanceFetcher } from './evmos/saddle.balance-fetcher';
import { EvmosSaddleMiniChefV2FarmContractPositionFetcher } from './evmos/saddle.mini-chef-v2-farm.contract-position-fetcher';
import { EvmosSaddlePoolTokenFetcher } from './evmos/saddle.pool.token-fetcher';
import { SaddleAppDefinition, SADDLE_DEFINITION } from './saddle.definition';

@Register.AppModule({
  appId: SADDLE_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    SaddleAppDefinition,
    SaddleContractFactory,
    // Helpers
    CurvePoolTokenHelper,
    CurvePoolVirtualPriceStrategy,
    CurvePoolOnChainCoinStrategy,
    CurvePoolOnChainReserveStrategy,
    // Ethereum
    EthereumSaddleBalanceFetcher,
    EthereumSaddleCommunalFarmContractPositionFetcher,
    EthereumSaddleMiniChefV2FarmContractPositionFetcher,
    EthereumSaddlePoolTokenFetcher,
    // Evmos
    EvmosSaddleBalanceFetcher,
    EvmosSaddleMiniChefV2FarmContractPositionFetcher,
    EvmosSaddlePoolTokenFetcher,
  ],
})
export class SaddleAppModule extends AbstractApp() {}
