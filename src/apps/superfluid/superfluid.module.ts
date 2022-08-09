import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { SuperfluidContractFactory } from './contracts';
import { PolygonSuperfluidBalanceFetcher } from './polygon/superfluid.balance-fetcher';
import { PolygonSuperfluidVaultTokenFetcher } from './polygon/superfluid.vault.token-fetcher';
import { SuperfluidAppDefinition, SUPERFLUID_DEFINITION } from './superfluid.definition';

@Register.AppModule({
  appId: SUPERFLUID_DEFINITION.id,
  providers: [
    SuperfluidAppDefinition,
    SuperfluidContractFactory,
    PolygonSuperfluidBalanceFetcher,
    PolygonSuperfluidVaultTokenFetcher,
  ],
})
export class SuperfluidAppModule extends AbstractApp() {}
