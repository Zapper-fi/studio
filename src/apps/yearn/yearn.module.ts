import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumYearnV2VaultTokenFetcher } from './arbitrum/yearn.v2-vault.token-fetcher';
import { YearnVaultTokenDefinitionsResolver } from './common/yearn.vault.token-definitions-resolver';
import { YearnContractFactory } from './contracts';
import { EthereumYearnGovernanceContractPositionFetcher } from './ethereum/yearn.governance.contract-position-fetcher';
import { EthereumYearnLpYCrvTokenTokenFetcher } from './ethereum/yearn.lp-y-crv.token-fetcher';
import { EthereumYearnStakedYCrvTokenTokenFetcher } from './ethereum/yearn.staked-y-crv.token-fetcher';
import { EthereumYearnV1VaultTokenFetcher } from './ethereum/yearn.v1-vault.token-fetcher';
import { EthereumYearnV2VaultTokenFetcher } from './ethereum/yearn.v2-vault.token-fetcher';
import { EthereumYearnYieldTokenFetcher } from './ethereum/yearn.yield.token-fetcher';
import { FantomYearnV2VaultTokenFetcher } from './fantom/yearn.v2-vault.token-fetcher';
import { YearnAppDefinition, YEARN_DEFINITION } from './yearn.definition';

@Register.AppModule({
  appId: YEARN_DEFINITION.id,
  providers: [
    YearnAppDefinition,
    YearnContractFactory,
    // Helpers
    YearnVaultTokenDefinitionsResolver,
    // Ethereum
    EthereumYearnGovernanceContractPositionFetcher,
    EthereumYearnV1VaultTokenFetcher,
    EthereumYearnV2VaultTokenFetcher,
    EthereumYearnYieldTokenFetcher,
    EthereumYearnStakedYCrvTokenTokenFetcher,
    EthereumYearnLpYCrvTokenTokenFetcher,
    // Fantom
    FantomYearnV2VaultTokenFetcher,
    // Arbitrum
    ArbitrumYearnV2VaultTokenFetcher,
  ],
  exports: [YearnContractFactory],
})
export class YearnAppModule extends AbstractApp() {}
