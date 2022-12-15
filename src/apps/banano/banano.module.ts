import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumBananoFarmContractPositionFetcher } from './arbitrum/banano.farm.contract-position-fetcher';
import BANANO_DEFINITION, { BananoAppDefinition } from './banano.definition';
import { BinanceSmartChainBananoFarmContractPositionFetcher } from './binance-smart-chain/banano.farm.contract-position-fetcher';
import { BananoContractFactory } from './contracts';
import { EthereumBananoFarmContractPositionFetcher } from './ethereum/banano.farm.contract-position-fetcher';
import { FantomBananoFarmContractPositionFetcher } from './fantom/banano.farm.contract-position-fetcher';
import { PolygonBananoFarmContractPositionFetcher } from './polygon/banano.farm.contract-position-fetcher';

@Register.AppModule({
  appId: BANANO_DEFINITION.id,
  providers: [
    BananoAppDefinition,
    BananoContractFactory,
    BinanceSmartChainBananoFarmContractPositionFetcher,
    PolygonBananoFarmContractPositionFetcher,
    FantomBananoFarmContractPositionFetcher,
    EthereumBananoFarmContractPositionFetcher,
    ArbitrumBananoFarmContractPositionFetcher,
  ],
})
export class BananoAppModule extends AbstractApp() {}
