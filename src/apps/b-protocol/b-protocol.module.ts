import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { CompoundViemContractFactory } from '~apps/compound/contracts';
import { MakerViemContractFactory } from '~apps/maker/contracts';

import { BProtocolViemContractFactory } from './contracts';
import { EthereumBProtocolCompoundBorrowContractPositionFetcher } from './ethereum/b-protocol.compound-borrow.contract-position-fetcher';
import { EthereumBProtocolCompoundSupplyTokenFetcher } from './ethereum/b-protocol.compound-supply.token-fetcher';
import { EthereumLiquityStabilityPoolContractPositionFetcher } from './ethereum/b-protocol.liquity-stability-pool.contract-position-fetcher';
import { EthereumBProtocolMakerVaultContractPositionFetcher } from './ethereum/b-protocol.maker-vault.contract-position-fetcher';

@Module({
  providers: [
    BProtocolViemContractFactory,
    CompoundViemContractFactory,
    MakerViemContractFactory,
    EthereumBProtocolCompoundSupplyTokenFetcher,
    EthereumBProtocolCompoundBorrowContractPositionFetcher,
    EthereumLiquityStabilityPoolContractPositionFetcher,
    EthereumBProtocolMakerVaultContractPositionFetcher,
  ],
})
export class BProtocolAppModule extends AbstractApp() {}
