import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { InverseViemContractFactory } from './contracts';
import { EthereumInverseBorrowContractPositionFetcher } from './ethereum/inverse.borrow.contract-position-fetcher';
import { EthereumInverseClaimableContractPositionFetcher } from './ethereum/inverse.claimable.contract-position-fetcher';
import { EthereumInverseDcaVaultDividendContractPositionFetcher } from './ethereum/inverse.dca-vault-dividend.contract-position-fetcher';
import { EthereumInverseFarmContractPositionFetcher } from './ethereum/inverse.farm.contract-position-fetcher';
import { EthereumInverseSupplyTokenFetcher } from './ethereum/inverse.supply.token-fetcher';

@Module({
  providers: [
    InverseViemContractFactory,
    EthereumInverseBorrowContractPositionFetcher,
    EthereumInverseClaimableContractPositionFetcher,
    EthereumInverseDcaVaultDividendContractPositionFetcher,
    EthereumInverseFarmContractPositionFetcher,
    EthereumInverseSupplyTokenFetcher,
  ],
})
export class InverseAppModule extends AbstractApp() {}
