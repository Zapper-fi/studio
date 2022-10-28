import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { WolfGameContractFactory } from './contracts';
import { EthereumWolfGameWoolPouchContractPositionFetcher } from './ethereum/wolf-game.wool-pouch.contract-position-fetcher';
import WOLF_GAME_DEFINITION, { WolfGameAppDefinition } from './wolf-game.definition';

@Register.AppModule({
  appId: WOLF_GAME_DEFINITION.id,
  providers: [WolfGameAppDefinition, WolfGameContractFactory, EthereumWolfGameWoolPouchContractPositionFetcher],
})
export class WolfGameAppModule extends AbstractApp() {}
