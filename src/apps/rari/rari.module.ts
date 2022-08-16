import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { RariContractFactory } from './contracts';
import { EthereumRariFarmContractPositionFetcher } from './ethereum/rari.farm.contract-position-fetcher';
import { EthereumRariFundTokenFetcher } from './ethereum/rari.fund.token-fetcher';
import { EthereumRariGovernanceContractPositionFetcher } from './ethereum/rari.governance.contract-position-fetcher';
import { RariAppDefinition, RARI_DEFINITION } from './rari.definition';

@Register.AppModule({
  appId: RARI_DEFINITION.id,
  providers: [
    RariAppDefinition,
    RariContractFactory,
    EthereumRariFarmContractPositionFetcher,
    EthereumRariFundTokenFetcher,
    EthereumRariGovernanceContractPositionFetcher,
  ],
})
export class RariAppModule extends AbstractApp() {}
