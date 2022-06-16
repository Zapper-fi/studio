import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { AuroraBluebitFarmContractPositionFetcher } from './aurora/bluebit.farm.contract-position-fetcher';
import { AuroraBluebitVaultTokenFetcher } from './aurora/bluebit.vault.token-fetcher';
import { BluebitAppDefinition, BLUEBIT_DEFINITION } from './bluebit.definition';
import { BluebitContractFactory } from './contracts';

@Register.AppModule({
  appId: BLUEBIT_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    AuroraBluebitFarmContractPositionFetcher,
    AuroraBluebitVaultTokenFetcher,
    BluebitAppDefinition,
    BluebitContractFactory,
  ],
})
export class BluebitAppModule extends AbstractApp() {}
