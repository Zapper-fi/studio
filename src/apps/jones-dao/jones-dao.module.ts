import { Register } from '~app-toolkit/decorators';

import { ArbitrumJonesDaoBalanceFetcher } from './arbitrum/jones-dao.balance-fetcher';
import { ArbitrumJonesDaoFarmContractPositionFetcher } from './arbitrum/jones-dao.farm.contract-position-fetcher';
import { ArbitrumJonesDaoVaultTokenFetcher } from './arbitrum/jones-dao.vault.token-fetcher';
import { JonesDaoContractFactory } from './contracts';
import { JonesDaoAppDefinition, JONES_DAO_DEFINITION } from './jones-dao.definition';

@Register.AppModule({
  appId: JONES_DAO_DEFINITION.id,
  providers: [
    JonesDaoAppDefinition,
    JonesDaoContractFactory,
    ArbitrumJonesDaoBalanceFetcher,
    ArbitrumJonesDaoFarmContractPositionFetcher,
    ArbitrumJonesDaoVaultTokenFetcher,
  ],
})
export class JonesDaoAppModule {}
