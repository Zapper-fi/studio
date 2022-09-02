import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import BARNBRIDGE_SMART_ALPHA_DEFINITION, {
  BarnbridgeSmartAlphaAppDefinition,
} from './barnbridge-smart-alpha.definition';
import { BarnbridgeSmartAlphaContractFactory } from './contracts';
import { EthereumBarnbridgeSmartAlphaJuniorTokenFetcher } from './ethereum/barnbridge-smart-alpha.junior-pool.token-fetcher';
import { EthereumBarnbridgeSmartAlphaSeniorTokenFetcher } from './ethereum/barnbridge-smart-alpha.senior-pool.token-fetcher';

@Register.AppModule({
  appId: BARNBRIDGE_SMART_ALPHA_DEFINITION.id,
  providers: [
    BarnbridgeSmartAlphaAppDefinition,
    BarnbridgeSmartAlphaContractFactory,
    EthereumBarnbridgeSmartAlphaJuniorTokenFetcher,
    EthereumBarnbridgeSmartAlphaSeniorTokenFetcher,
  ],
})
export class BarnbridgeSmartAlphaAppModule extends AbstractApp() {}
