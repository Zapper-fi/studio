import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainOpenleveragePoolTokenFetcher } from './binance-smart-chain/openleverage.pool.token-fetcher';
import { OpenleverageContractFactory } from './contracts';
import { EthereumOpenleveragePoolTokenFetcher } from './ethereum/openleverage.pool.token-fetcher';
import { OpenleverageAppDefinition, OPENLEVERAGE_DEFINITION } from './openleverage.definition';
import { OpenleveragePoolAPYHelper } from './helpers/openleverage-pool.apy-helper';

@Register.AppModule({
  appId: OPENLEVERAGE_DEFINITION.id,
  providers: [
    EthereumOpenleveragePoolTokenFetcher,
    BinanceSmartChainOpenleveragePoolTokenFetcher,
    OpenleverageAppDefinition,
    OpenleverageContractFactory,
    OpenleveragePoolAPYHelper
  ],
})
export class OpenleverageAppModule extends AbstractApp() { }
