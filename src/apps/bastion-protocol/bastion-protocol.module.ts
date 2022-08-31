import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import {
  CurvePoolOnChainCoinStrategy,
  CurvePoolOnChainReserveStrategy,
  CurvePoolTokenHelper,
  CurvePoolVirtualPriceStrategy,
} from '~apps/curve';

import { AuroraBastionProtocolBalanceFetcher } from './aurora/bastion-protocol.balance-fetcher';
import { AuroraBastionProtocolBorrowAuroraEcosystemContractPositionFetcher } from './aurora/bastion-protocol.borrow-aurora-ecosystem.contract-position-fetcher';
import { AuroraBastionProtocolBorrowMainHubContractPositionFetcher } from './aurora/bastion-protocol.borrow-main-hub.contract-position-fetcher';
import { AuroraBastionProtocolBorrowMultichainContractPositionFetcher } from './aurora/bastion-protocol.borrow-multichain.contract-position-fetcher';
import { AuroraBastionProtocolBorrowStakedNearContractPositionFetcher } from './aurora/bastion-protocol.borrow-staked-near.contract-position-fetcher';
import { AuroraBastionProtocolSupplyAuroraEcosystemTokenFetcher } from './aurora/bastion-protocol.supply-aurora-ecosystem.token-fetcher';
import { AuroraBastionProtocolSupplyMainHubTokenFetcher } from './aurora/bastion-protocol.supply-main-hub.token-fetcher';
import { AuroraBastionProtocolSupplyMultichainTokenFetcher } from './aurora/bastion-protocol.supply-multichain.token-fetcher';
import { AuroraBastionProtocolSupplyStakedNearTokenFetcher } from './aurora/bastion-protocol.supply-staked-near.token-fetcher';
import { AuroraBastionProtocolSwapTokenFetcher } from './aurora/bastion-protocol.swap.token-fetcher';
import { BastionProtocolAppDefinition, BASTION_PROTOCOL_DEFINITION } from './bastion-protocol.definition';
import { BastionProtocolContractFactory } from './contracts';
import { BastionBorrowContractPositionHelper } from './helper/bastion-protocol.borrow.contract-position-helper';
import { BastionSupplyTokenHelper } from './helper/bastion-protocol.supply.token-helper';

@Register.AppModule({
  appId: BASTION_PROTOCOL_DEFINITION.id,
  providers: [
    AuroraBastionProtocolBalanceFetcher,
    BastionProtocolAppDefinition,
    BastionProtocolContractFactory,
    AuroraBastionProtocolSwapTokenFetcher,
    // Supply fetchers
    AuroraBastionProtocolSupplyMainHubTokenFetcher,
    AuroraBastionProtocolSupplyStakedNearTokenFetcher,
    AuroraBastionProtocolSupplyAuroraEcosystemTokenFetcher,
    AuroraBastionProtocolSupplyMultichainTokenFetcher,
    // Borrow fetchers
    AuroraBastionProtocolBorrowMainHubContractPositionFetcher,
    AuroraBastionProtocolBorrowStakedNearContractPositionFetcher,
    AuroraBastionProtocolBorrowAuroraEcosystemContractPositionFetcher,
    AuroraBastionProtocolBorrowMultichainContractPositionFetcher,
    // Helpers
    BastionSupplyTokenHelper,
    BastionBorrowContractPositionHelper,
    CurvePoolTokenHelper,
    CurvePoolOnChainCoinStrategy,
    CurvePoolOnChainReserveStrategy,
    CurvePoolVirtualPriceStrategy,
  ],
})
export class BastionProtocolAppModule extends AbstractApp() {}
