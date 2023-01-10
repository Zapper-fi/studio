import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundContractFactory } from '~apps/compound';
import { MakerContractFactory } from '~apps/maker';

import { BProtocolContractFactory } from './contracts';
import { EthereumBProtocolCompoundBorrowContractPositionFetcher } from './ethereum/b-protocol.compound-borrow.contract-position-fetcher';
import { EthereumBProtocolCompoundSupplyTokenFetcher } from './ethereum/b-protocol.compound-supply.token-fetcher';
import { EthereumLiquityStabilityPoolContractPositionFetcher } from './ethereum/b-protocol.liquity-stability-pool.contract-position-fetcher';
import { EthereumBProtocolMakerVaultContractPositionFetcher } from './ethereum/b-protocol.maker-vault.contract-position-fetcher';

import { BProtocolAppDefinition } from '.';

@Module({
  providers: [
    BProtocolAppDefinition,
    BProtocolContractFactory,
    CompoundContractFactory,
    MakerContractFactory,
    EthereumBProtocolCompoundSupplyTokenFetcher,
    EthereumBProtocolCompoundBorrowContractPositionFetcher,
    EthereumLiquityStabilityPoolContractPositionFetcher,
    EthereumBProtocolMakerVaultContractPositionFetcher,
  ],
})
export class BProtocolAppModule extends AbstractApp() {}
