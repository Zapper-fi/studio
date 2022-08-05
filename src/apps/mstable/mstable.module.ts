import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { MstableContractFactory } from './contracts';
import { EthereumMstableBalanceFetcher } from './ethereum/mstable.balance-fetcher';
import { EthereumMstableEarnContractPositionFetcher } from './ethereum/mstable.earn.contract-position-fetcher';
import { EthereumMstableImusdTokenFetcher } from './ethereum/mstable.imusd.token-fetcher';
import { EthereumMstableMtaV1FarmContractPositionFetcher } from './ethereum/mstable.mta-v1-farm.contract-position-fetcher';
import { EthereumMstableMtaV2FarmContractPositionFetcher } from './ethereum/mstable.mta-v2-farm.contract-position-fetcher';
import { EthereumMstableSavingsVaultContractPositionFetcher } from './ethereum/mstable.savings-vault.contract-position-fetcher';
import { MstableAppDefinition, MSTABLE_DEFINITION } from './mstable.definition';
import { PolygonMstableBalanceFetcher } from './polygon/mstable.balance-fetcher';
import { PolygonMstableImusdTokenFetcher } from './polygon/mstable.imusd.token-fetcher';
import { PolygonMstableSavingsVaultContractPositionFetcher } from './polygon/mstable.savings-vault-farm.contract-position-fetcher';

@Register.AppModule({
  appId: MSTABLE_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    MstableAppDefinition,
    MstableContractFactory,
    EthereumMstableBalanceFetcher,
    EthereumMstableImusdTokenFetcher,
    EthereumMstableSavingsVaultContractPositionFetcher,
    EthereumMstableMtaV1FarmContractPositionFetcher,
    EthereumMstableMtaV2FarmContractPositionFetcher,
    EthereumMstableEarnContractPositionFetcher,
    PolygonMstableBalanceFetcher,
    PolygonMstableImusdTokenFetcher,
    PolygonMstableSavingsVaultContractPositionFetcher,
  ],
  exports: [MstableAppDefinition, MstableContractFactory],
})
export class MStableAppModule extends AbstractApp() {}
