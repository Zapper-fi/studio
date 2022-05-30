import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound';

import { RariFuseContractFactory } from './contracts';
import { EthereumRariFuseBalancePresenter } from './ethereum/rari-fuse.balance-presenter';
import { EthereumRariFuseBorrowContractPositionBalanceFetcher } from './ethereum/rari-fuse.borrow.contract-position-balance-fetcher';
import { EthereumRariFuseBorrowContractPositionFetcher } from './ethereum/rari-fuse.borrow.contract-position-fetcher';
import { EthereumRariFuseSupplyTokenFetcher } from './ethereum/rari-fuse.supply.token-fetcher';
import { RariFuseAppDefinition, RARI_FUSE_DEFINITION } from './rari-fuse.definition';

@Register.AppModule({
  appId: RARI_FUSE_DEFINITION.id,
  imports: [CompoundAppModule],
  providers: [
    RariFuseAppDefinition,
    RariFuseContractFactory,
    // Ethereum
    EthereumRariFuseBalancePresenter,
    EthereumRariFuseBorrowContractPositionFetcher,
    EthereumRariFuseBorrowContractPositionBalanceFetcher,
    EthereumRariFuseSupplyTokenFetcher,
  ],
})
export class RariFuseAppModule extends AbstractApp() {}
