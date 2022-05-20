import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PolynomialContractFactory } from './contracts';
import { OptimismPolynomialBalanceFetcher } from './optimism/polynomial.balance-fetcher';
import { OptimismPolynomialVaultsTokenFetcher } from './optimism/polynomial.vaults.token-fetcher';
import { PolynomialAppDefinition, POLYNOMIAL_DEFINITION } from './polynomial.definition';

@Register.AppModule({
  appId: POLYNOMIAL_DEFINITION.id,
  providers: [
    OptimismPolynomialBalanceFetcher,
    OptimismPolynomialVaultsTokenFetcher,
    PolynomialAppDefinition,
    PolynomialContractFactory,
  ],
})
export class PolynomialAppModule extends AbstractApp() {}
