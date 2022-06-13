import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule, CompoundSupplyTokenHelper } from '~apps/compound';
import { CurvePoolTokenHelper } from '~apps/curve';

import { AuroraBastionProtocolBalanceFetcher } from './aurora/bastion-protocol.balance-fetcher';
import { AuroraBastionProtocolBorrowContractPositionFetcher } from './aurora/bastion-protocol.borrow.contract-position-fetcher';
import { AuroraBastionProtocolSupplyTokenFetcher } from './aurora/bastion-protocol.supply.token-fetcher';
import { AuroraBastionProtocolSwapTokenFetcher } from './aurora/bastion-protocol.swap.token-fetcher';
import { AuroraBastionProtocolTvlFetcher } from './aurora/bastion-protocol.tvl-fetcher';
import { BastionProtocolAppDefinition, BASTION_PROTOCOL_DEFINITION } from './bastion-protocol.definition';
import { BastionProtocolContractFactory } from './contracts';
import { BastionSupplyTokenHelper } from './helper/bastion-protocol.supply.token-helper';

@Register.AppModule({
  appId: BASTION_PROTOCOL_DEFINITION.id,
  providers: [
    AuroraBastionProtocolBalanceFetcher,
    AuroraBastionProtocolBorrowContractPositionFetcher,
    AuroraBastionProtocolSupplyTokenFetcher,
    AuroraBastionProtocolSwapTokenFetcher,
    AuroraBastionProtocolTvlFetcher,
    BastionProtocolAppDefinition,
    BastionProtocolContractFactory,
    BastionSupplyTokenHelper,
    CurvePoolTokenHelper,
  ],
})
export class BastionProtocolAppModule extends AbstractApp() { }
