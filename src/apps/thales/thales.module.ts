import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ThalesContractFactory } from './contracts';
import { OptimismThalesEscrowContractPositionFetcher } from './optimism/thales.escrow.contract-position-fetcher';
import { ArbitrumThalesEscrowContractPositionFetcher } from './arbitrum/thales.escrow.contract-position-fetcher';
import { OptimismThalesPool2ContractPositionFetcher } from './optimism/thales.pool2.contract-position-fetcher';
import { OptimismThalesStakingContractPositionFetcher } from './optimism/thales.staking.contract-position-fetcher';
import { ArbitrumThalesStakingContractPositionFetcher } from './arbitrum/thales.staking.contract-position-fetcher';
import { OptimismThalesVaultContractPositionFetcher } from './optimism/thales.vault.contract-position-fetcher';
import { ArbitrumThalesVaultContractPositionFetcher } from './arbitrum/thales.vault.contract-position-fetcher';
import { OptimismThalesOvertimeAmmLpContractPositionFetcher } from './optimism/thales.overtime-amm-lp.contract-position-fetcher';
import { ArbitrumThalesOvertimeAmmLpContractPositionFetcher } from './arbitrum/thales.overtime-amm-lp.contract-position-fetcher';

@Module({
  providers: [
    ThalesContractFactory,
    OptimismThalesStakingContractPositionFetcher,
    ArbitrumThalesStakingContractPositionFetcher,
    OptimismThalesEscrowContractPositionFetcher,
    ArbitrumThalesEscrowContractPositionFetcher,
    OptimismThalesPool2ContractPositionFetcher,
    OptimismThalesVaultContractPositionFetcher,
    ArbitrumThalesVaultContractPositionFetcher,
    OptimismThalesOvertimeAmmLpContractPositionFetcher,
    ArbitrumThalesOvertimeAmmLpContractPositionFetcher,
  ],
})
export class ThalesAppModule extends AbstractApp() { }
