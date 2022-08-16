import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainOpenleveragePoolTokenFetcher } from './binance-smart-chain/openleverage.pool.token-fetcher';
import { EthereumOpenleveragePoolTokenFetcher } from './ethereum/openleverage.pool.token-fetcher';
import { OpenleverageContractFactory } from './contracts';
import { OpenleverageAppDefinition, OPENLEVERAGE_DEFINITION } from './openleverage.definition';

@Register.AppModule({
  appId: OPENLEVERAGE_DEFINITION.id,
  providers: [EthereumOpenleveragePoolTokenFetcher, BinanceSmartChainOpenleveragePoolTokenFetcher, OpenleverageAppDefinition, OpenleverageContractFactory],
})
export class OpenleverageAppModule extends AbstractApp() { }
