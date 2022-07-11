import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import {
  CurvePoolOnChainCoinStrategy,
  CurvePoolOnChainReserveStrategy,
  CurvePoolTokenHelper,
  CurvePoolVirtualPriceStrategy,
} from '~apps/curve';

import { FerroContractFactory } from './contracts';
import { CronosFerroBalanceFetcher } from './cronos/ferro.balance-fetcher';
import { CronosFerroPoolTokenFetcher } from './cronos/ferro.pool.token-fetcher';
import { CronosFerroStakedLiquidityContractPositionFetcher } from './cronos/ferro.staked-liquidity.contract-position-fetcher';
import { CronosFerroXferVaultContractPositionFetcher } from './cronos/ferro.xfer-vault.contract-position-fetcher';
import { CronosFerroXferTokenFetcher } from './cronos/ferro.xfer.token-fetcher';
import { FerroAppDefinition, FERRO_DEFINITION } from './ferro.definition';

@Register.AppModule({
  appId: FERRO_DEFINITION.id,
  providers: [
    CronosFerroBalanceFetcher,
    CronosFerroPoolTokenFetcher,
    CronosFerroStakedLiquidityContractPositionFetcher,
    CronosFerroXferTokenFetcher,
    CronosFerroXferVaultContractPositionFetcher,
    CurvePoolTokenHelper,
    CurvePoolVirtualPriceStrategy,
    CurvePoolOnChainCoinStrategy,
    CurvePoolOnChainReserveStrategy,
    FerroAppDefinition,
    FerroContractFactory,
  ],
})
export class FerroAppModule extends AbstractApp() {}
