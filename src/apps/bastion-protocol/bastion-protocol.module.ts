import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraBastionProtocolAuroraEcosystemBorrowContractPositionFetcher } from './aurora/bastion-protocol.aurora-ecosystem-borrow.contract-position-fetcher';
import { AuroraBastionProtocolAuroraEcosystemSupplyTokenFetcher } from './aurora/bastion-protocol.aurora-ecosystem-supply.token-fetcher';
import { AuroraBastionProtocolMainHubBorrowContractPositionFetcher } from './aurora/bastion-protocol.main-hub-borrow.contract-position-fetcher';
import { AuroraBastionProtocolMainHubSupplyTokenFetcher } from './aurora/bastion-protocol.main-hub-supply.token-fetcher';
import { AuroraBastionProtocolMultichainBorrowContractPositionFetcher } from './aurora/bastion-protocol.multichain-borrow.contract-position-fetcher';
import { AuroraBastionProtocolMultichainSupplyTokenFetcher } from './aurora/bastion-protocol.multichain-supply.token-fetcher';
import { AuroraBastionProtocolPoolTokenFetcher } from './aurora/bastion-protocol.pool.token-fetcher';
import { AuroraBastionProtocolPositionPresenter } from './aurora/bastion-protocol.position-presenter';
import { AuroraBastionProtocolStakedNearBorrowContractPositionFetcher } from './aurora/bastion-protocol.staked-near-borrow.contract-position-fetcher';
import { AuroraBastionProtocolStakedNearSupplyTokenFetcher } from './aurora/bastion-protocol.staked-near-supply.token-fetcher';
import { BastionProtocolContractFactory } from './contracts';

@Module({
  providers: [
    BastionProtocolContractFactory,
    AuroraBastionProtocolPoolTokenFetcher,
    AuroraBastionProtocolMainHubSupplyTokenFetcher,
    AuroraBastionProtocolStakedNearSupplyTokenFetcher,
    AuroraBastionProtocolAuroraEcosystemSupplyTokenFetcher,
    AuroraBastionProtocolMultichainSupplyTokenFetcher,
    AuroraBastionProtocolMainHubBorrowContractPositionFetcher,
    AuroraBastionProtocolStakedNearBorrowContractPositionFetcher,
    AuroraBastionProtocolAuroraEcosystemBorrowContractPositionFetcher,
    AuroraBastionProtocolMultichainBorrowContractPositionFetcher,
    AuroraBastionProtocolPositionPresenter,
  ],
})
export class BastionProtocolAppModule extends AbstractApp() {}
