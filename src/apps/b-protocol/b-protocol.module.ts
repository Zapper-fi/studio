import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundContractFactory } from '~apps/compound/contracts';
import { MakerContractFactory } from '~apps/maker/contracts';

import { BProtocolAppDefinition } from './b-protocol.definition';
import { BProtocolContractFactory } from './contracts';
import { EthereumBProtocolCompoundBorrowContractPositionFetcher } from './ethereum/b-protocol.compound-borrow.contract-position-fetcher';
import { EthereumBProtocolCompoundSupplyTokenFetcher } from './ethereum/b-protocol.compound-supply.token-fetcher';
import { EthereumLiquityStabilityPoolContractPositionFetcher } from './ethereum/b-protocol.liquity-stability-pool.contract-position-fetcher';
import { EthereumBProtocolMakerVaultContractPositionFetcher } from './ethereum/b-protocol.maker-vault.contract-position-fetcher';

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
