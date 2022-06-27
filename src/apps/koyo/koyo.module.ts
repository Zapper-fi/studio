import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { KoyoContractFactory } from './contracts';
import { KoyoAppDefinition, KOYO_DEFINITION } from './koyo.definition';

@Register.AppModule({
  appId: KOYO_DEFINITION.id,
  providers: [KoyoAppDefinition, KoyoContractFactory],
})
export class KoyoAppModule extends AbstractApp() {}
