import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SynthetixMintrSnxHoldersCache } from './common/synthetix.mintr.snx-holders.cache';
import { SynthetixContractFactory } from './contracts';
import { EthereumSynthetixFarmContractPositionFetcher } from './ethereum/synthetix.farm.contract-position-fetcher';
import { EthereumSynthetixLoanContractPositionFetcher } from './ethereum/synthetix.loan.contract-position-fetcher';
import { EthereumSynthetixMintrContractPositionFetcher } from './ethereum/synthetix.mintr.contract-position-fetcher';
import { EthereumSynthetixPositionPresenter } from './ethereum/synthetix.position-presenter';
import { EthereumSynthetixSnxTokenFetcher } from './ethereum/synthetix.snx.token-fetcher';
import { EthereumSynthetixSynthTokenFetcher } from './ethereum/synthetix.synth.token-fetcher';
import { OptimismSynthetixLoanContractPositionFetcher } from './optimism/synthetix.loan.contract-position-fetcher';
import { OptimismSynthetixMintrContractPositionFetcher } from './optimism/synthetix.mintr.contract-position-fetcher';
import { OptimismSynthetixPositionPresenter } from './optimism/synthetix.position-presenter';
import { OptimismSynthetixSnxTokenFetcher } from './optimism/synthetix.snx.token-fetcher';
import { OptimismSynthetixSynthTokenFetcher } from './optimism/synthetix.synth.token-fetcher';
import { SynthetixAppDefinition } from './synthetix.definition';

@Module({
  providers: [
    SynthetixAppDefinition,
    SynthetixContractFactory,
    SynthetixMintrSnxHoldersCache,
    // Ethereum
    EthereumSynthetixFarmContractPositionFetcher,
    EthereumSynthetixMintrContractPositionFetcher,
    EthereumSynthetixSynthTokenFetcher,
    EthereumSynthetixSnxTokenFetcher,
    EthereumSynthetixLoanContractPositionFetcher,
    EthereumSynthetixPositionPresenter,
    // Optimism
    OptimismSynthetixMintrContractPositionFetcher,
    OptimismSynthetixSynthTokenFetcher,
    OptimismSynthetixSnxTokenFetcher,
    OptimismSynthetixLoanContractPositionFetcher,
    OptimismSynthetixPositionPresenter,
  ],
})
export class SynthetixAppModule extends AbstractApp() {}
