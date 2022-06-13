import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AurigamiAppDefinition, AURIGAMI_DEFINITION } from './aurigami.definition';
import { AurigamiContractFactory } from './contracts';

@Register.AppModule({
  appId: AURIGAMI_DEFINITION.id,
  providers: [AurigamiAppDefinition, AurigamiContractFactory],
})
export class AurigamiAppModule extends AbstractApp() {}
