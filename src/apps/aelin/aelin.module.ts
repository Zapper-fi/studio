import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix/synthetix.module';

import { AelinAppDefinition, AELIN_DEFINITION } from './aelin.definition';
import { AelinContractFactory } from './contracts';
import { EthereumAelinBalanceFetcher } from './ethereum/aelin.balance-fetcher';
import { EthereumAelinPoolTokenFetcher } from './ethereum/aelin.pool.token-fetcher';
import { OptimismAelinBalanceFetcher } from './optimism/aelin.balance-fetcher';
import { OptimismAelinFarmContractPositionFetcher } from './optimism/aelin.farm.contract-position-fetcher';
import { OptimismAelinPoolTokenFetcher } from './optimism/aelin.pool.token-fetcher';
import { OptimismAelinVAelinTokenFetcher } from './optimism/aelin.v-aelin.token-fetcher';

@Register.AppModule({
  appId: AELIN_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    AelinAppDefinition,
    AelinContractFactory,
    // Ethereum
    EthereumAelinBalanceFetcher,
    EthereumAelinPoolTokenFetcher,
    // Optimism
    OptimismAelinPoolTokenFetcher,
    OptimismAelinVAelinTokenFetcher,
    OptimismAelinBalanceFetcher,
    OptimismAelinFarmContractPositionFetcher,
  ],
})
export class AelinAppModule extends AbstractApp() {}
