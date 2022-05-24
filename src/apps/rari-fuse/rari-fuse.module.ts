import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundAppModule } from '~apps/compound';

import { RariFuseContractFactory } from './contracts';
import { EthereumRariFuseBalanceFetcher } from './ethereum/rari-fuse.balance-fetcher';
import { EthereumRariFuseBorrowContractPositionFetcher } from './ethereum/rari-fuse.borrow.contract-position-fetcher';
import { EthereumRariFuseSupplyTokenFetcher } from './ethereum/rari-fuse.supply.token-fetcher';
import { RariFuseLendingBalanceHelper } from './helpers/rari-fuse.lending.balance-helper';
import { RariFuseAppDefinition, RARI_FUSE_DEFINITION } from './rari-fuse.definition';

@Register.AppModule({
  appId: RARI_FUSE_DEFINITION.id,
  imports: [CompoundAppModule],
  providers: [
    EthereumRariFuseBalanceFetcher,
    EthereumRariFuseBorrowContractPositionFetcher,
    EthereumRariFuseSupplyTokenFetcher,
    RariFuseAppDefinition,
    RariFuseContractFactory,
    RariFuseLendingBalanceHelper,
  ],
})
export class RariFuseAppModule extends AbstractApp() {}
