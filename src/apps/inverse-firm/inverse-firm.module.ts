import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { InverseFirmViemContractFactory } from './contracts';
import { EthereumInverseFirmLoanContractPositionFetcher } from './ethereum/inverse-firm.loan.contract-position-fetcher';

@Module({
  providers: [InverseFirmViemContractFactory, EthereumInverseFirmLoanContractPositionFetcher],
})
export class InverseFirmAppModule extends AbstractApp() {}
