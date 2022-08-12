import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PolynomialContractFactory } from './contracts';
import { OptimismPolynomialBalanceFetcher } from './optimism/polynomial.balance-fetcher';
import { OptimismPolynomialVaultsContractPositionFetcher } from './optimism/polynomial.vaults.contract-position-fetcher';
import { OptimismPolynomialVaultsTokenFetcher } from './optimism/polynomial.vaults.token-fetcher';
import { PolynomialAppDefinition, POLYNOMIAL_DEFINITION } from './polynomial.definition';
import { PolynomialApiHelper } from './helpers/polynomial.api'

@Register.AppModule({
  appId: POLYNOMIAL_DEFINITION.id,
  providers: [
    PolynomialApiHelper,
    OptimismPolynomialBalanceFetcher,
    OptimismPolynomialVaultsContractPositionFetcher,
    OptimismPolynomialVaultsTokenFetcher,
    PolynomialAppDefinition,
    PolynomialContractFactory,
  ],
})
export class PolynomialAppModule extends AbstractApp() { }
