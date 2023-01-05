import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PolynomialContractFactory } from './contracts';
import { PolynomialApiHelper } from './helpers/polynomial.api';
import { OptimismPolynomialBalanceFetcher } from './optimism/polynomial.balance-fetcher';
import { OptimismPolynomialVaultsContractPositionFetcher } from './optimism/polynomial.vaults.contract-position-fetcher';
import { OptimismPolynomialVaultsTokenFetcher } from './optimism/polynomial.vaults.token-fetcher';
import { PolynomialAppDefinition } from './polynomial.definition';

@Module({
  providers: [
    PolynomialApiHelper,
    OptimismPolynomialBalanceFetcher,
    OptimismPolynomialVaultsContractPositionFetcher,
    OptimismPolynomialVaultsTokenFetcher,
    PolynomialAppDefinition,
    PolynomialContractFactory,
  ],
})
export class PolynomialAppModule extends AbstractApp() {}
