import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AgaveAppDefinition, AGAVE_DEFINITION } from './agave.definition';
import { AgaveContractFactory } from './contracts';

@Register.AppModule({
  appId: AGAVE_DEFINITION.id,
  providers: [AgaveAppDefinition, AgaveContractFactory],
})
export class AgaveAppModule extends AbstractApp() {}
