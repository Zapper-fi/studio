import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraBastionProtocolBalanceFetcher } from './aurora/bastion-protocol.balance-fetcher';
import { AuroraBastionProtocolBorrowContractPositionFetcher } from './aurora/bastion-protocol.borrow.contract-position-fetcher';
import { AuroraBastionProtocolSupplyMultichainTokenFetcher } from './aurora/bastion-protocol.supply-multichain.token-fetcher';
import { AuroraBastionProtocolSupplyStakedNearTokenFetcher } from './aurora/bastion-protocol.supply-staked-near.token-fetcher';
import { AuroraBastionProtocolSupplyTokenFetcher } from './aurora/bastion-protocol.supply.token-fetcher';
import { AuroraBastionProtocolSuppyAuroraTokenFetcher } from './aurora/bastion-protocol.suppy-aurora.token-fetcher';
import { AuroraBastionProtocolTvlFetcher } from './aurora/bastion-protocol.tvl-fetcher';
import { BastionProtocolAppDefinition, BASTION_PROTOCOL_DEFINITION } from './bastion-protocol.definition';
import { BastionProtocolContractFactory } from './contracts';
import { BastionSupplyTokenHelper } from './helper/bastion-protocol.supply.token-helper';

@Register.AppModule({
  appId: BASTION_PROTOCOL_DEFINITION.id,
  providers: [
    AuroraBastionProtocolBalanceFetcher,
    AuroraBastionProtocolBorrowContractPositionFetcher,
    AuroraBastionProtocolSupplyMultichainTokenFetcher,
    AuroraBastionProtocolSupplyStakedNearTokenFetcher,
    AuroraBastionProtocolSupplyTokenFetcher,
    AuroraBastionProtocolSuppyAuroraTokenFetcher,
    AuroraBastionProtocolTvlFetcher,
    BastionProtocolAppDefinition,
    BastionProtocolContractFactory,
    BastionSupplyTokenHelper,
  ],
})
export class BastionProtocolAppModule extends AbstractApp() {}
