import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { ArbitrumYearnBalanceFetcher } from './arbitrum/yearn.balance-fetcher';
import { ArbitrumYearnV2VaultTokenFetcher } from './arbitrum/yearn.v2-vault.token-fetcher';
import { YearnContractFactory } from './contracts';
import { EthereumYearnBalanceFetcher } from './ethereum/yearn.balance-fetcher';
import { EthereumYearnGovernanceContractPositionFetcher } from './ethereum/yearn.governance.contract-position-fetcher';
import { EthereumYearnV1VaultTokenFetcher } from './ethereum/yearn.v1-vault.token-fetcher';
import { EthereumYearnV2VaultTokenFetcher } from './ethereum/yearn.v2-vault.token-fetcher';
import { EthereumYearnYieldTokenFetcher } from './ethereum/yearn.yield.token-fetcher';
import { FantomYearnBalanceFetcher } from './fantom/yearn.balance-fetcher';
import { FantomYearnV2VaultTokenFetcher } from './fantom/yearn.v2-vault.token-fetcher';
import { YearnV1VaultTokenHelper } from './helpers/yearn.v1-vault.token-helper';
import { YearnV2VaultTokenHelper } from './helpers/yearn.v2-vault.token-helper';
import { YearnVaultTokenDefinitionsResolver } from './helpers/yearn.vault.token-definitions-resolver';
import { YearnAppDefinition, YEARN_DEFINITION } from './yearn.definition';

@Register.AppModule({
  appId: YEARN_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    YearnAppDefinition,
    YearnContractFactory,
    // Helpers
    YearnV1VaultTokenHelper,
    YearnV2VaultTokenHelper,
    YearnVaultTokenDefinitionsResolver,
    // Ethereum
    EthereumYearnBalanceFetcher,
    EthereumYearnV1VaultTokenFetcher,
    EthereumYearnV2VaultTokenFetcher,
    EthereumYearnGovernanceContractPositionFetcher,
    EthereumYearnYieldTokenFetcher,
    // Fantom
    FantomYearnBalanceFetcher,
    FantomYearnV2VaultTokenFetcher,
    // Arbitrum
    ArbitrumYearnBalanceFetcher,
    ArbitrumYearnV2VaultTokenFetcher,
  ],
  exports: [YearnContractFactory],
})
export class YearnAppModule extends AbstractApp() {}
