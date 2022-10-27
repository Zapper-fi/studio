import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { WolfGameContractFactory } from './contracts';
import WOLF_GAME_DEFINITION, { WolfGameAppDefinition } from './wolf-game.definition';

@Register.AppModule({
  appId: WOLF_GAME_DEFINITION.id,
  providers: [WolfGameAppDefinition, WolfGameContractFactory],
})
export class WolfGameAppModule extends AbstractApp() {}
