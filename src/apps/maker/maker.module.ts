import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { MakerContractFactory } from './contracts';
import { EthereumMakerBalanceFetcher } from './ethereum/maker.balance-fetcher';
import { EthereumMakerGovernanceContractPositionFetcher } from './ethereum/maker.governance.contract-position-fetcher';
import { EthereumMakerVaultContractPositionFetcher } from './ethereum/maker.vault.contract-position-fetcher';
import { MakerAppDefinition, MAKER_DEFINITION } from './maker.definition';

@Register.AppModule({
  appId: MAKER_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    MakerAppDefinition,
    MakerContractFactory,
    EthereumMakerBalanceFetcher,
    EthereumMakerGovernanceContractPositionFetcher,
    EthereumMakerVaultContractPositionFetcher,
  ],
})
export class MakerAppModule extends AbstractApp() {}
