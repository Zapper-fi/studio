import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainBolideBalanceFetcher } from './binance-smart-chain/bolide.balance-fetcher';
import { BinanceBolideVaultContractPositionFetcher } from './binance-smart-chain/bolide.vault.contract-position-fetcher';
import { BolideAppDefinition, BOLIDE_DEFINITION } from './bolide.definition';
import { BolideContractFactory } from './contracts';

@Register.AppModule({
  appId: BOLIDE_DEFINITION.id,
  providers: [
    BinanceBolideVaultContractPositionFetcher,
    BinanceSmartChainBolideBalanceFetcher,
    BolideAppDefinition,
    BolideContractFactory,
  ],
})
export class BolideAppModule extends AbstractApp() {}
