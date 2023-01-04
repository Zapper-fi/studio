import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumJonesDaoFarmContractPositionFetcher } from './arbitrum/jones-dao.farm.contract-position-fetcher';
import { ArbitrumJonesDaoMetavaultTokenFetcher } from './arbitrum/jones-dao.metavault.contract-position-fetcher';
import { ArbitrumJonesDaoMillinerV2ContractPositionFetcher } from './arbitrum/jones-dao.milliner-v2.contract-position-fetcher';
import { ArbitrumJonesDaoVaultTokenFetcher } from './arbitrum/jones-dao.vault.token-fetcher';
import { JonesDaoContractFactory } from './contracts';
import { JonesDaoAppDefinition, JONES_DAO_DEFINITION } from './jones-dao.definition';

@Register.AppModule({
  appId: JONES_DAO_DEFINITION.id,
  providers: [
    JonesDaoAppDefinition,
    JonesDaoContractFactory,
    ArbitrumJonesDaoFarmContractPositionFetcher,
    ArbitrumJonesDaoMillinerV2ContractPositionFetcher,
    ArbitrumJonesDaoVaultTokenFetcher,
    ArbitrumJonesDaoMetavaultTokenFetcher,
  ],
})
export class JonesDaoAppModule extends AbstractApp() {}
