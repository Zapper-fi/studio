import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { OpenskyContractFactory } from './contracts';
import { EthereumOpenskyBalanceFetcher } from './ethereum/opensky.balance-fetcher';
import { EthereumOpenskyBorrowContractPositionFetcher } from './ethereum/opensky.borrow.contract-position-fetcher';
import { EthereumOpenskySupplyTokenFetcher } from './ethereum/opensky.supply.token-fetcher';
import { OpenskyAppDefinition, OPENSKY_DEFINITION } from './opensky.definition';

@Register.AppModule({
  appId: OPENSKY_DEFINITION.id,
  providers: [
    EthereumOpenskyBalanceFetcher,
    EthereumOpenskyBorrowContractPositionFetcher,
    EthereumOpenskySupplyTokenFetcher,
    OpenskyAppDefinition,
    OpenskyContractFactory,
  ],
})
export class OpenskyAppModule extends AbstractApp() {}
