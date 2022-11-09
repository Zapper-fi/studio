import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { MidasContractFactory } from './contracts';
import { MidasAppDefinition, MIDAS_DEFINITION } from './midas.definition';

@Register.AppModule({
  appId: MIDAS_DEFINITION.id,
  providers: [MidasAppDefinition, MidasContractFactory],
})
export class MidasAppModule extends AbstractApp() {}
