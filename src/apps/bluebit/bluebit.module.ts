import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { AuroraBluebitBalanceFetcher } from './aurora/bluebit.balance-fetcher';
import { AuroraBluebitFarmContractPositionFetcher } from './aurora/bluebit.farm.contract-position-fetcher';
import { BluebitAppDefinition, BLUEBIT_DEFINITION } from './bluebit.definition';
import { BluebitContractFactory } from './contracts';

@Register.AppModule({
  appId: BLUEBIT_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    AuroraBluebitBalanceFetcher,
    AuroraBluebitFarmContractPositionFetcher,
    BluebitAppDefinition,
    BluebitContractFactory,
  ],
})
export class BluebitAppModule extends AbstractApp() {}
