import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { PolynomialContractFactory } from './contracts';
import { PolynomialApiHelper } from './helpers/polynomial.api';
import { OptimismPolynomialCoveredCallPoolTokenFetcher } from './optimism/polynomial.covered-call-pool.token-fetcher';
import { OptimismPolynomialCoveredCallVaultContractPositionFetcher } from './optimism/polynomial.covered-call-vault.contract-position-fetcher';
import { OptimismPolynomialPutSellingPoolTokenFetcher } from './optimism/polynomial.put-sellilng-pool.token-fetcher';
import { OptimismPolynomialPutSellingVaultContractPositionFetcher } from './optimism/polynomial.put-selling-vault.contract-position-fetcher';
import { PolynomialAppDefinition } from './polynomial.definition';

@Module({
  providers: [
    PolynomialApiHelper,
    PolynomialAppDefinition,
    PolynomialContractFactory,
    OptimismPolynomialCoveredCallPoolTokenFetcher,
    OptimismPolynomialCoveredCallVaultContractPositionFetcher,
    OptimismPolynomialPutSellingPoolTokenFetcher,
    OptimismPolynomialPutSellingVaultContractPositionFetcher,
  ],
})
export class PolynomialAppModule extends AbstractApp() {}
