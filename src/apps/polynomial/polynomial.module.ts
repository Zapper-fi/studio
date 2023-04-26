import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { SynthetixContractFactory } from '../synthetix/contracts';

import { PolynomialAccountResolver } from './common/polynomial.account-resolver';
import { PolynomialApiHelper } from './common/polynomial.api';
import { PolynomialContractFactory } from './contracts';
import { OptimismPolynomialCallSellingVaultQueueContractPositionFetcher } from './optimism/polynomial.call-selling-vault-queue.contract-position-fetcher';
import { OptimismPolynomialCallSellingVaultTokenFetcher } from './optimism/polynomial.call-selling-vault.token-fetcher';
import { OptimismPolynomialPerpContractPositionFetcher } from './optimism/polynomial.perp.contract-position-fetcher';
import { OptimismPolynomialPutSellingVaultQueueContractPositionFetcher } from './optimism/polynomial.put-selling-vault-queue.contract-position-fetcher';
import { OptimismPolynomialPutSellingVaultTokenFetcher } from './optimism/polynomial.put-selling-vault.token-fetcher';
import { OptimismPolynomialSmartWalletContractPositionFetcher } from './optimism/polynomial.smart-wallet.contract-position-fetcher';

@Module({
  providers: [
    PolynomialApiHelper,
    PolynomialAccountResolver,
    PolynomialContractFactory,
    SynthetixContractFactory,
    OptimismPolynomialCallSellingVaultTokenFetcher,
    OptimismPolynomialCallSellingVaultQueueContractPositionFetcher,
    OptimismPolynomialPutSellingVaultTokenFetcher,
    OptimismPolynomialPutSellingVaultQueueContractPositionFetcher,
    OptimismPolynomialPerpContractPositionFetcher,
    OptimismPolynomialSmartWalletContractPositionFetcher,
  ],
})
export class PolynomialAppModule extends AbstractApp() {}
