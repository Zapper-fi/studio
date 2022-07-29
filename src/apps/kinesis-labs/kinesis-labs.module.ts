import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CurvePoolTokenHelper, CurvePoolVirtualPriceStrategy } from '~apps/curve';

import { KinesisLabsContractFactory } from './contracts';
import { EvmosKinesisLabsPoolTokenFetcher } from './evmos/kinesis-labs.pool.token-fetcher';
import { KinesisLabsAppDefinition, KINESIS_LABS_DEFINITION } from './kinesis-labs.definition';

@Register.AppModule({
  appId: KINESIS_LABS_DEFINITION.id,
  providers: [
    EvmosKinesisLabsPoolTokenFetcher,
    KinesisLabsAppDefinition,
    KinesisLabsContractFactory,
    CurvePoolTokenHelper,
    CurvePoolVirtualPriceStrategy,
  ],
})
export class KinesisLabsAppModule extends AbstractApp() {}
