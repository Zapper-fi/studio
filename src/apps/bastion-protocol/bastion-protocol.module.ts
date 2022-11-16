import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AuroraBastionProtocolBorrowAuroraEcosystemContractPositionFetcher } from './aurora/bastion-protocol.borrow-aurora-ecosystem.contract-position-fetcher';
import { AuroraBastionProtocolBorrowMainHubContractPositionFetcher } from './aurora/bastion-protocol.borrow-main-hub.contract-position-fetcher';
import { AuroraBastionProtocolBorrowMultichainContractPositionFetcher } from './aurora/bastion-protocol.borrow-multichain.contract-position-fetcher';
import { AuroraBastionProtocolBorrowStakedNearContractPositionFetcher } from './aurora/bastion-protocol.borrow-staked-near.contract-position-fetcher';
import { AuroraBastionProtocolPoolTokenFetcher } from './aurora/bastion-protocol.pool.token-fetcher';
import { AuroraBastionProtocolPositionPresenter } from './aurora/bastion-protocol.position-presenter';
import { AuroraBastionProtocolSupplyAuroraEcosystemTokenFetcher } from './aurora/bastion-protocol.supply-aurora-ecosystem.token-fetcher';
import { AuroraBastionProtocolSupplyMainHubTokenFetcher } from './aurora/bastion-protocol.supply-main-hub.token-fetcher';
import { AuroraBastionProtocolSupplyMultichainTokenFetcher } from './aurora/bastion-protocol.supply-multichain.token-fetcher';
import { AuroraBastionProtocolSupplyStakedNearTokenFetcher } from './aurora/bastion-protocol.supply-staked-near.token-fetcher';
import { BastionProtocolAppDefinition, BASTION_PROTOCOL_DEFINITION } from './bastion-protocol.definition';
import { BastionProtocolContractFactory } from './contracts';

@Register.AppModule({
  appId: BASTION_PROTOCOL_DEFINITION.id,
  providers: [
    BastionProtocolAppDefinition,
    BastionProtocolContractFactory,
    AuroraBastionProtocolPoolTokenFetcher,
    AuroraBastionProtocolSupplyMainHubTokenFetcher,
    AuroraBastionProtocolSupplyStakedNearTokenFetcher,
    AuroraBastionProtocolSupplyAuroraEcosystemTokenFetcher,
    AuroraBastionProtocolSupplyMultichainTokenFetcher,
    AuroraBastionProtocolBorrowMainHubContractPositionFetcher,
    AuroraBastionProtocolBorrowStakedNearContractPositionFetcher,
    AuroraBastionProtocolBorrowAuroraEcosystemContractPositionFetcher,
    AuroraBastionProtocolBorrowMultichainContractPositionFetcher,
    AuroraBastionProtocolPositionPresenter,
  ],
})
export class BastionProtocolAppModule extends AbstractApp() {}
