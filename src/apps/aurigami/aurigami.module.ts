import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound';

import { AurigamiAppDefinition, AURIGAMI_DEFINITION } from './aurigami.definition';
import { AuroraAurigamiSupplyTokenFetcher } from './aurora/aurigami.supply.token-fetcher';
import { AurigamiContractFactory } from './contracts';

@Register.AppModule({
  appId: AURIGAMI_DEFINITION.id,
  imports: [CompoundAppModule],
  providers: [AurigamiAppDefinition, AurigamiContractFactory, AuroraAurigamiSupplyTokenFetcher],
})
export class AurigamiAppModule extends AbstractApp() {}
