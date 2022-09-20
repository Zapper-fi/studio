import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { RariFuseContractFactory } from './contracts';
import { EthereumRariFuseBorrowContractPositionFetcher } from './ethereum/rari-fuse.borrow.contract-position-fetcher';
import { EthereumRariFusePositionPresenter } from './ethereum/rari-fuse.position-presenter';
import { EthereumRariFuseSupplyTokenFetcher } from './ethereum/rari-fuse.supply.token-fetcher';
import { RariFuseAppDefinition, RARI_FUSE_DEFINITION } from './rari-fuse.definition';

@Register.AppModule({
  appId: RARI_FUSE_DEFINITION.id,
  providers: [
    RariFuseAppDefinition,
    RariFuseContractFactory,
    // Ethereum
    EthereumRariFuseBorrowContractPositionFetcher,
    EthereumRariFuseSupplyTokenFetcher,
    EthereumRariFusePositionPresenter,
  ],
})
export class RariFuseAppModule extends AbstractApp() {}
