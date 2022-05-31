import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { SynthetixContractFactory } from './contracts';
import { EthereumSynthetixFarmContractPositionBalanceFetcher } from './ethereum/synthetix.farm.contract-position-balance-fetcher';
import { EthereumSynthetixFarmContractPositionFetcher } from './ethereum/synthetix.farm.contract-position-fetcher';
import { EthereumSynthetixMintrContractPositionBalanceFetcher } from './ethereum/synthetix.mintr.contract-position-balance-fetcher';
import { EthereumSynthetixMintrContractPositionFetcher } from './ethereum/synthetix.mintr.contract-position-fetcher';
import { EthereumSynthetixSynthTokenBalanceFetcher } from './ethereum/synthetix.synth.token-balance-fetcher';
import { EthereumSynthetixSynthTokenFetcher } from './ethereum/synthetix.synth.token-fetcher';
import { EthereumSynthetixTransferrableSnxBalanceFetcher } from './ethereum/synthetix.transferrable-snx.token-balance-fetcher';
import { EthereumSynthetixTransferrableSnxTokenFetcher } from './ethereum/synthetix.transferrable-snx.token-fetcher';
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
import { SynthetixTrasnferrableSnxTokenBalanceHelper } from './helpers/synthetix.transferrable-snx.token-balance-helper';
import { SynthetixTrasnferrableSnxTokenHelper } from './helpers/synthetix.trasnferrable-snx.token-helper';
import { OptimismSynthetixMintrContractPositionBalanceFetcher } from './optimism/synthetix.mintr.contract-position-balance-fetcher';
import { OptimismSynthetixMintrContractPositionFetcher } from './optimism/synthetix.mintr.contract-position-fetcher';
import { OptimismSynthetixSynthTokenBalanceFetcher } from './optimism/synthetix.synth.token-balance-fetcher';
import { OptimismSynthetixSynthTokenFetcher } from './optimism/synthetix.synth.token-fetcher';
import { OptimismSynthetixTransferrableSnxBalanceFetcher } from './optimism/synthetix.transferrable-snx.token-balance-fetcher';
import { OptimismSynthetixTransferrableSnxTokenFetcher } from './optimism/synthetix.transferrable-snx.token-fetcher';
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
    EthereumSynthetixTransferrableSnxTokenFetcher,
    EthereumSynthetixTransferrableSnxBalanceFetcher,
    EthereumSynthetixTvlFetcher,
    // Optimism
    OptimismSynthetixMintrContractPositionFetcher,
    OptimismSynthetixMintrContractPositionBalanceFetcher,
    OptimismSynthetixSynthTokenFetcher,
    OptimismSynthetixSynthTokenBalanceFetcher,
    OptimismSynthetixTransferrableSnxTokenFetcher,
    OptimismSynthetixTransferrableSnxBalanceFetcher,
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
