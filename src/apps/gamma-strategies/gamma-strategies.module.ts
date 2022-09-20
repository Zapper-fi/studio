import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { GammaStrategiesContractFactory } from './contracts';
import { EthereumGammaStrategiesBalanceFetcher } from './ethereum/gamma-strategies.balance-fetcher';
import { EthereumGammaStrategiesPoolTokenFetcher } from './ethereum/gamma-strategies.pool.token-fetcher';
import { EthereumGammaStrategiesTGammaTokenFetcher } from './ethereum/gamma-strategies.t-gamma.token-fetcher';
import { EthereumGammaStrategiesXGammaTokenFetcher } from './ethereum/gamma-strategies.x-gamma.token-fetcher';
import { GammaStrategiesAppDefinition, GAMMA_STRATEGIES_DEFINITION } from './gamma-strategies.definition';

@Register.AppModule({
  appId: GAMMA_STRATEGIES_DEFINITION.id,
  providers: [
    GammaStrategiesAppDefinition,
    GammaStrategiesContractFactory,
    EthereumGammaStrategiesBalanceFetcher,
    EthereumGammaStrategiesPoolTokenFetcher,
    EthereumGammaStrategiesXGammaTokenFetcher,
    EthereumGammaStrategiesTGammaTokenFetcher,
  ],
})
export class GammaStrategiesAppModule extends AbstractApp() {}
