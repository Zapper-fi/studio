import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { CONVEX_ARBITRUM_PROVIDERS } from './arbitrum';
import { ConvexContractFactory } from './contracts';
import { ConvexAppDefinition, CONVEX_DEFINITION } from './convex.definition';
import { CONVEX_ETHEREUM_PROVIDERS } from './ethereum';

@Register.AppModule({
  appId: CONVEX_DEFINITION.id,
  providers: [ConvexAppDefinition, ConvexContractFactory, ...CONVEX_ARBITRUM_PROVIDERS, ...CONVEX_ETHEREUM_PROVIDERS],
})
export class ConvexAppModule extends AbstractApp() {}
