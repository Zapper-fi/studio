import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ConcentratorContractFactory } from './contracts';
import { EthereumConcentratorAbcCvxTokenFetcher } from './ethereum/concentrator.abc.token-fetcher';
import { EthereumConcentratorCompounderTokenFetcher } from './ethereum/concentrator.compounder.token-fetcher';
import { EthereumConcentratorAcrvVaultContractPositionFetcher } from './ethereum/concentrator.acrv-vault.contract-position-fetcher';
import { EthereumConcentratorAfrxethVaultContractPositionFetcher } from './ethereum/concentrator.afrxeth-vault.contract-position-fetcher';
import { EthereumConcentratorAfxsVaultContractPositionFetcher } from './ethereum/concentrator.afxs-vault.contract-position-fetcher';
import { EthereumConcentratorLegacyVaultContractPositionFetcher } from './ethereum/concentrator.legacy-vault.contract-position-fetcher';
import { EthereumConcentratorVotingEscrowContractPositionFetcher } from './ethereum/concentrator.voting-escrow.contract-position-fetcher';
import { EthereumConcentratorVestingContractPositionFetcher } from './ethereum/concentrator.vesting.contract-position-fetcher';

@Module({
  providers: [
    ConcentratorContractFactory,
    EthereumConcentratorAbcCvxTokenFetcher,
    EthereumConcentratorAcrvVaultContractPositionFetcher,
    EthereumConcentratorAfxsVaultContractPositionFetcher,
    EthereumConcentratorCompounderTokenFetcher,
    EthereumConcentratorLegacyVaultContractPositionFetcher,
    EthereumConcentratorAfrxethVaultContractPositionFetcher,
    EthereumConcentratorVotingEscrowContractPositionFetcher,
    EthereumConcentratorVestingContractPositionFetcher,
  ],
})
export class ConcentratorAppModule extends AbstractApp() {}
