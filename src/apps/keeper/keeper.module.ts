import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { KeeperContractFactory } from './contracts';
import { EthereumKeeperJobContractPositionFetcher } from './ethereum/keeper.job.contract-position-fetcher';
import { EthereumKeeperBondContractPositionFetcher } from './ethereum/keeper.keeper-bond.contract-position-fetcher';
import { EthereumKeeperUnbondContractPositionFetcher } from './ethereum/keeper.keeper-unbond.contract-position-fetcher';
import { EthereumKeeperKlpTokenFetcher } from './ethereum/keeper.klp.token-fetcher';
import { EthereumKeeperRedeemableTokenFetcher } from './ethereum/keeper.redeemable.token-fetcher';
import { EthereumKeeperVestContractPositionFetcher } from './ethereum/keeper.vest.contract-position-fetcher';
import { KeeperAppDefinition, KEEPER_DEFINITION } from './keeper.definition';

@Register.AppModule({
  appId: KEEPER_DEFINITION.id,
  providers: [
    EthereumKeeperUnbondContractPositionFetcher,
    EthereumKeeperBondContractPositionFetcher,
    EthereumKeeperJobContractPositionFetcher,
    EthereumKeeperKlpTokenFetcher,
    EthereumKeeperRedeemableTokenFetcher,
    EthereumKeeperVestContractPositionFetcher,
    KeeperAppDefinition,
    KeeperContractFactory,
  ],
})
export class KeeperAppModule extends AbstractApp() {}
