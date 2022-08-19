import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { ArbitrumYearnV2VaultTokenFetcher } from './arbitrum/yearn.v2-vault.token-fetcher';
import { YearnContractFactory } from './contracts';
import { EthereumYearnGovernanceContractPositionFetcher } from './ethereum/yearn.governance.contract-position-fetcher';
import { EthereumYearnV1VaultTokenFetcher } from './ethereum/yearn.v1-vault.token-fetcher';
import { EthereumYearnV2VaultTokenFetcher } from './ethereum/yearn.v2-vault.token-fetcher';
import { EthereumYearnYieldTokenFetcher } from './ethereum/yearn.yield.token-fetcher';
import { FantomYearnV2VaultTokenFetcher } from './fantom/yearn.v2-vault.token-fetcher';
import { YearnVaultTokenDefinitionsResolver } from './helpers/yearn.vault.token-definitions-resolver';
import { YearnAppDefinition, YEARN_DEFINITION } from './yearn.definition';

@Register.AppModule({
  appId: YEARN_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    YearnAppDefinition,
    YearnContractFactory,
    // Helpers
    YearnVaultTokenDefinitionsResolver,
    // Ethereum
    EthereumYearnV1VaultTokenFetcher,
    EthereumYearnV2VaultTokenFetcher,
    EthereumYearnGovernanceContractPositionFetcher,
    EthereumYearnYieldTokenFetcher,
    // Fantom
    FantomYearnV2VaultTokenFetcher,
    // Arbitrum
    ArbitrumYearnV2VaultTokenFetcher,
  ],
  exports: [YearnContractFactory],
})
export class YearnAppModule extends AbstractApp() {}
