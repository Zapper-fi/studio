import {Register} from '~app-toolkit/decorators';
import {AbstractApp} from '~app/app.dynamic-module';

import {PhutureContractFactory} from './contracts';
import {PHUTURE_DEFINITION, PhutureAppDefinition} from "./phuture.definition";

@Register.AppModule({
    appId: PHUTURE_DEFINITION.id,
    providers: [PhutureAppDefinition, PhutureContractFactory],
})
export class PhutureAppModule extends AbstractApp() {
}
