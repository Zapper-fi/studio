import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { ArbitrumYearnBalanceFetcher } from './arbitrum/yearn.balance-fetcher';
import { ArbitrumYearnVaultTokenFetcher } from './arbitrum/yearn.vault.token-fetcher';
import { YearnContractFactory } from './contracts';
import { EthereumYearnBalanceFetcher } from './ethereum/yearn.balance-fetcher';
import { EthereumYearnFarmContractPositionFetcher } from './ethereum/yearn.farm.contract-position-fetcher';
import { EthereumYearnVaultTokenFetcher } from './ethereum/yearn.vault.token-fetcher';
import { EthereumYearnYieldTokenFetcher } from './ethereum/yearn.yield.token-fetcher';
import { FantomYearnBalanceFetcher } from './fantom/yearn.balance-fetcher';
import { FantomYearnVaultTokenFetcher } from './fantom/yearn.vault.token-fetcher';
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
    EthereumYearnVaultTokenFetcher,
    EthereumYearnYieldTokenFetcher,
    FantomYearnBalanceFetcher,
    FantomYearnVaultTokenFetcher,
    ArbitrumYearnBalanceFetcher,
    ArbitrumYearnVaultTokenFetcher,
  ],
  exports: [YearnContractFactory],
})
export class YearnAppModule extends AbstractApp() {}
