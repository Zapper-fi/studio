import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CurvePoolTokenHelper, CurveVirtualPriceStrategy } from '~apps/curve';

import { KinesisLabsContractFactory } from './contracts';
import { EvmosKinesisLabsPoolTokenFetcher } from './evmos/kinesis-labs.pool.token-fetcher';
import { KinesisLabsOnChainCoinStrategy } from './helpers/kinesis-labs.on-chain.coin-strategy';
import { KinesisLabsOnChainReserveStrategy } from './helpers/kinesis-labs.on-chain.reserve-strategy';
import { KinesisLabsAppDefinition, KINESIS_LABS_DEFINITION } from './kinesis-labs.definition';

@Register.AppModule({
  appId: KINESIS_LABS_DEFINITION.id,
  providers: [
    EvmosKinesisLabsPoolTokenFetcher,
    KinesisLabsAppDefinition,
    KinesisLabsContractFactory,
    CurvePoolTokenHelper,
    CurveVirtualPriceStrategy,
    KinesisLabsOnChainCoinStrategy,
    KinesisLabsOnChainReserveStrategy,
  ],
})
export class KinesisLabsAppModule extends AbstractApp() {}
