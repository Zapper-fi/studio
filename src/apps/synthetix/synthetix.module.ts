import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { SynthetixContractFactory } from './contracts';
import { EthereumSynthetixBalancePresenter } from './ethereum/synthetix.balance-presenter';
import { EthereumSynthetixFarmContractPositionBalanceFetcher } from './ethereum/synthetix.farm.contract-position-balance-fetcher';
import { EthereumSynthetixFarmContractPositionFetcher } from './ethereum/synthetix.farm.contract-position-fetcher';
import { EthereumSynthetixMintrContractPositionBalanceFetcher } from './ethereum/synthetix.mintr.contract-position-balance-fetcher';
import { EthereumSynthetixMintrContractPositionFetcher } from './ethereum/synthetix.mintr.contract-position-fetcher';
import { EthereumSynthetixSynthTokenBalanceFetcher } from './ethereum/synthetix.synth.token-balance-fetcher';
import { EthereumSynthetixSynthTokenFetcher } from './ethereum/synthetix.synth.token-fetcher';
import { EthereumSynthetixTransferableSnxBalanceFetcher } from './ethereum/synthetix.transferable-snx.token-balance-fetcher';
import { EthereumSynthetixTransferableSnxTokenFetcher } from './ethereum/synthetix.transferable-snx.token-fetcher';
import { EthereumSynthetixTvlFetcher } from './ethereum/synthetix.tvl-fetcher';
import { SynthetixMintrContractPositionBalanceHelper } from './helpers/synthetix.mintr.contract-position-balance-helper';
import { SynthetixMintrContractPositionHelper } from './helpers/synthetix.mintr.contract-position-helper';
import { SynthetixMintrMetaHelper } from './helpers/synthetix.mintr.meta-helper';
import { SynthetixSingleStakingFarmContractPositionBalanceHelper } from './helpers/synthetix.single-staking-farm-contract-position-balance-helper';
import { SynthetixSingleStakingFarmContractPositionHelper } from './helpers/synthetix.single-staking-farm-contract-position-helper';
import { SynthetixSingleStakingIsActiveStrategy } from './helpers/synthetix.single-staking.is-active-strategy';
import { SynthetixSingleStakingRoiStrategy } from './helpers/synthetix.single-staking.roi-strategy';
import { SynthetixSynthTokenBalanceHelper } from './helpers/synthetix.synth.token-balance-helper';
import { SynthetixSynthTokenHelper } from './helpers/synthetix.synth.token-helper';
import { SynthetixTrasnferrableSnxTokenBalanceHelper } from './helpers/synthetix.transferable-snx.token-balance-helper';
import { SynthetixTrasnferrableSnxTokenHelper } from './helpers/synthetix.trasnferable-snx.token-helper';
import { OptimismSynthetixBalancePresenter } from './optimism/synthetix.balance-presenter';
import { OptimismSynthetixMintrContractPositionBalanceFetcher } from './optimism/synthetix.mintr.contract-position-balance-fetcher';
import { OptimismSynthetixMintrContractPositionFetcher } from './optimism/synthetix.mintr.contract-position-fetcher';
import { OptimismSynthetixSynthTokenBalanceFetcher } from './optimism/synthetix.synth.token-balance-fetcher';
import { OptimismSynthetixSynthTokenFetcher } from './optimism/synthetix.synth.token-fetcher';
import { OptimismSynthetixTransferableSnxBalanceFetcher } from './optimism/synthetix.transferable-snx.token-balance-fetcher';
import { OptimismSynthetixTransferableSnxTokenFetcher } from './optimism/synthetix.transferable-snx.token-fetcher';
import { OptimismSynthetixTvlFetcher } from './optimism/synthetix.tvl-fetcher';
import { SynthetixAppDefinition, SYNTHETIX_DEFINITION } from './synthetix.definition';

@Register.AppModule({
  appId: SYNTHETIX_DEFINITION.id,
  providers: [
    SynthetixAppDefinition,
    SynthetixContractFactory,
    SynthetixSingleStakingIsActiveStrategy,
    SynthetixSingleStakingRoiStrategy,
    SynthetixSingleStakingFarmContractPositionHelper,
    SynthetixSingleStakingFarmContractPositionBalanceHelper,
    SynthetixMintrMetaHelper,
    SynthetixMintrContractPositionHelper,
    SynthetixMintrContractPositionBalanceHelper,
    SynthetixSynthTokenHelper,
    SynthetixSynthTokenBalanceHelper,
    SynthetixTrasnferrableSnxTokenHelper,
    SynthetixTrasnferrableSnxTokenBalanceHelper,
    // Ethereum
    EthereumSynthetixFarmContractPositionFetcher,
    EthereumSynthetixFarmContractPositionBalanceFetcher,
    EthereumSynthetixMintrContractPositionFetcher,
    EthereumSynthetixMintrContractPositionBalanceFetcher,
    EthereumSynthetixSynthTokenFetcher,
    EthereumSynthetixSynthTokenBalanceFetcher,
    EthereumSynthetixTransferableSnxTokenFetcher,
    EthereumSynthetixTransferableSnxBalanceFetcher,
    EthereumSynthetixBalancePresenter,
    EthereumSynthetixTvlFetcher,
    // Optimism
    OptimismSynthetixMintrContractPositionFetcher,
    OptimismSynthetixMintrContractPositionBalanceFetcher,
    OptimismSynthetixSynthTokenFetcher,
    OptimismSynthetixSynthTokenBalanceFetcher,
    OptimismSynthetixTransferableSnxTokenFetcher,
    OptimismSynthetixTransferableSnxBalanceFetcher,
    OptimismSynthetixBalancePresenter,
    OptimismSynthetixTvlFetcher,
  ],
  exports: [
    SynthetixContractFactory,
    SynthetixSingleStakingIsActiveStrategy,
    SynthetixSingleStakingRoiStrategy,
    SynthetixSingleStakingFarmContractPositionHelper,
    SynthetixSingleStakingFarmContractPositionBalanceHelper,
  ],
})
export class SynthetixAppModule extends AbstractApp() {}
