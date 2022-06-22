import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { ArbitrumYearnBalanceFetcher } from './arbitrum/yearn.balance-fetcher';
import { ArbitrumYearnV1VaultTokenFetcher } from './arbitrum/yearn.v1-vault.token-fetcher';
import { ArbitrumYearnV2VaultTokenFetcher } from './arbitrum/yearn.v2-vault.token-fetcher';
import { YearnContractFactory } from './contracts';
import { EthereumYearnBalanceFetcher } from './ethereum/yearn.balance-fetcher';
import { EthereumYearnFarmContractPositionFetcher } from './ethereum/yearn.farm.contract-position-fetcher';
import { EthereumYearnV1VaultTokenFetcher } from './ethereum/yearn.v1-vault.token-fetcher';
import { EthereumYearnV2VaultTokenFetcher } from './ethereum/yearn.v2-vault.token-fetcher';
import { EthereumYearnYieldTokenFetcher } from './ethereum/yearn.yield.token-fetcher';
import { FantomYearnBalanceFetcher } from './fantom/yearn.balance-fetcher';
import { FantomYearnV1VaultTokenFetcher } from './fantom/yearn.v1-vault.token-fetcher';
import { FantomYearnV2VaultTokenFetcher } from './fantom/yearn.v2-vault.token-fetcher';
import { YearnVaultTokenDefinitionsResolver } from './helpers/yearn.vault.token-definitions-resolver';
import { YearnVaultTokenHelper } from './helpers/yearn.vault.token-helper';
import { YearnAppDefinition, YEARN_DEFINITION } from './yearn.definition';

@Register.AppModule({
  appId: YEARN_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    YearnAppDefinition,
    YearnContractFactory,
    YearnVaultTokenHelper,
    YearnVaultTokenDefinitionsResolver,
    EthereumYearnBalanceFetcher,
    EthereumYearnFarmContractPositionFetcher,
    EthereumYearnV1VaultTokenFetcher,
    EthereumYearnV2VaultTokenFetcher,
    EthereumYearnYieldTokenFetcher,
    FantomYearnBalanceFetcher,
    FantomYearnV1VaultTokenFetcher,
    FantomYearnV2VaultTokenFetcher,
    ArbitrumYearnBalanceFetcher,
    ArbitrumYearnV1VaultTokenFetcher,
    ArbitrumYearnV2VaultTokenFetcher,
  ],
  exports: [YearnContractFactory],
})
export class YearnAppModule extends AbstractApp() {}
