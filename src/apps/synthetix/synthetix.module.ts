import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { SynthetixContractFactory } from './contracts';
import { EthereumSynthetixFarmContractPositionFetcher } from './ethereum/synthetix.farm.contract-position-fetcher';
import { EthereumSynthetixLoanContractPositionFetcher } from './ethereum/synthetix.loan.contract-position-fetcher';
import { EthereumSynthetixMintrContractPositionFetcher } from './ethereum/synthetix.mintr.contract-position-fetcher';
import { EthereumSynthetixPositionPresenter } from './ethereum/synthetix.position-presenter';
import { EthereumSynthetixSynthTokenFetcher } from './ethereum/synthetix.synth.token-fetcher';
import { EthereumSynthetixTransferableSnxTokenFetcher } from './ethereum/synthetix.transferable-snx.token-fetcher';
import { SynthetixSingleStakingFarmContractPositionBalanceHelper } from './helpers/synthetix.single-staking-farm-contract-position-balance-helper';
import { SynthetixSingleStakingFarmContractPositionHelper } from './helpers/synthetix.single-staking-farm-contract-position-helper';
import { SynthetixSingleStakingIsActiveStrategy } from './helpers/synthetix.single-staking.is-active-strategy';
import { SynthetixSingleStakingRoiStrategy } from './helpers/synthetix.single-staking.roi-strategy';
import { OptimismSynthetixLoanContractPositionFetcher } from './optimism/synthetix.loan.contract-position-fetcher';
import { OptimismSynthetixMintrContractPositionFetcher } from './optimism/synthetix.mintr.contract-position-fetcher';
import { OptimismSynthetixPositionPresenter } from './optimism/synthetix.position-presenter';
import { OptimismSynthetixSynthTokenFetcher } from './optimism/synthetix.synth.token-fetcher';
import { OptimismSynthetixTransferableSnxTokenFetcher } from './optimism/synthetix.transferable-snx.token-fetcher';
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
    // Ethereum
    EthereumSynthetixFarmContractPositionFetcher,
    EthereumSynthetixMintrContractPositionFetcher,
    EthereumSynthetixSynthTokenFetcher,
    EthereumSynthetixTransferableSnxTokenFetcher,
    EthereumSynthetixLoanContractPositionFetcher,
    EthereumSynthetixPositionPresenter,
    // Optimism
    OptimismSynthetixMintrContractPositionFetcher,
    OptimismSynthetixSynthTokenFetcher,
    OptimismSynthetixTransferableSnxTokenFetcher,
    OptimismSynthetixLoanContractPositionFetcher,
    OptimismSynthetixPositionPresenter,
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
