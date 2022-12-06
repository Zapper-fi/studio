import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import APECOIN_DEFINITION, { ApecoinAppDefinition } from './apecoin.definition';
import { ApecoinContractFactory } from './contracts';
import { EthereumApecoinStakingContractPositionFetcher } from './ethereum/apecoin.staking.contract-position-fetcher';

@Register.AppModule({
  appId: APECOIN_DEFINITION.id,
  providers: [ApecoinAppDefinition, ApecoinContractFactory, EthereumApecoinStakingContractPositionFetcher],
})
export class ApecoinAppModule extends AbstractApp() {}
