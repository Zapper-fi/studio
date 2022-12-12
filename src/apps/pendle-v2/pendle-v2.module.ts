import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PendleV2ContractFactory } from './contracts';
import { PendleV2AppDefinition, PENDLE_V_2_DEFINITION } from './pendle-v2.definition';

@Register.AppModule({
  appId: PENDLE_V_2_DEFINITION.id,
  providers: [PendleV2AppDefinition, PendleV2ContractFactory],
})
export class PendleV2AppModule extends AbstractApp() {}
