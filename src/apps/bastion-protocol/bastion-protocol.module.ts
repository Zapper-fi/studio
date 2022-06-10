import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraBastionProtocolBalanceFetcher } from './aurora/bastion-protocol.balance-fetcher';
import { AuroraBastionProtocolBorrowContractPositionFetcher } from './aurora/bastion-protocol.borrow.contract-position-fetcher';
import { AuroraBastionProtocolSupplyTokenFetcher } from './aurora/bastion-protocol.supply.token-fetcher';
import { AuroraBastionProtocolTvlFetcher } from './aurora/bastion-protocol.tvl-fetcher';
import { BastionProtocolAppDefinition, BASTION_PROTOCOL_DEFINITION } from './bastion-protocol.definition';
import { BastionProtocolContractFactory } from './contracts';

@Register.AppModule({
  appId: BASTION_PROTOCOL_DEFINITION.id,
  providers: [
    AuroraBastionProtocolBalanceFetcher,
    AuroraBastionProtocolBorrowContractPositionFetcher,
    AuroraBastionProtocolSupplyTokenFetcher,
    AuroraBastionProtocolTvlFetcher,
    BastionProtocolAppDefinition,
    BastionProtocolContractFactory,
  ],
})
export class BastionProtocolAppModule extends AbstractApp() {}
