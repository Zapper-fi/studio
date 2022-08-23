import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { BottoAppDefinition, BOTTO_DEFINITION } from './botto.definition';
import { BottoContractFactory } from './contracts';
import { EthereumBottoFarmContractPositionFetcher } from './ethereum/botto.farm.contract-position-fetcher';
import { EthereumBottoGovernanceContractPositionFetcher } from './ethereum/botto.governance.contract-position-fetcher';

@Register.AppModule({
  appId: BOTTO_DEFINITION.id,
  providers: [
    BottoAppDefinition,
    BottoContractFactory,
    EthereumBottoFarmContractPositionFetcher,
    EthereumBottoGovernanceContractPositionFetcher,
  ],
})
export class BottoAppModule extends AbstractApp() {}
