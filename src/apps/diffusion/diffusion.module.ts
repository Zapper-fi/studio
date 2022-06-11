import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { DiffusionContractFactory } from './contracts';
import { DiffusionAppDefinition, DIFFUSION_DEFINITION } from './diffusion.definition';

@Register.AppModule({
  appId: DIFFUSION_DEFINITION.id,
  providers: [DiffusionAppDefinition, DiffusionContractFactory],
})
export class DiffusionAppModule extends AbstractApp() {}
