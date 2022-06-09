import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CurvePoolTokenHelper, CurveVirtualPriceStrategy } from '~apps/curve';
import { SynthetixAppModule } from '~apps/synthetix';

import { SaddleContractFactory } from './contracts';
import { EthereumSaddleBalanceFetcher } from './ethereum/saddle.balance-fetcher';
import { EthereumSaddleCommunalFarmContractPositionFetcher } from './ethereum/saddle.communal-farm.contract-position-fetcher';
import { EthereumSaddleMiniChefV2FarmContractPositionFetcher } from './ethereum/saddle.mini-chef-v2-farm.contract-position-fetcher';
import { EthereumSaddlePoolTokenFetcher } from './ethereum/saddle.pool.token-fetcher';
import { EvmosSaddlePoolTokenFetcher } from './evmos/saddle.pool.token-fetcher';
import { SaddleOnChainCoinStrategy } from './helpers/saddle.on-chain.coin-strategy';
import { SaddleOnChainReserveStrategy } from './helpers/saddle.on-chain.reserve-strategy';
import { SaddleAppDefinition, SADDLE_DEFINITION } from './saddle.definition';

@Register.AppModule({
  appId: SADDLE_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    CurvePoolTokenHelper,
    CurveVirtualPriceStrategy,
    EthereumSaddleBalanceFetcher,
    EthereumSaddleCommunalFarmContractPositionFetcher,
    EthereumSaddleMiniChefV2FarmContractPositionFetcher,
    EthereumSaddlePoolTokenFetcher,
    EvmosSaddlePoolTokenFetcher,
    EvmosSaddleCommunalFarmContractPositionFetcher,
    EvmosSaddleMiniChefV2FarmContractPositionFetcher
    SaddleAppDefinition,
    SaddleContractFactory,
    SaddleOnChainCoinStrategy,
    SaddleOnChainReserveStrategy,
  ],
})
export class SaddleAppModule extends AbstractApp() {}
