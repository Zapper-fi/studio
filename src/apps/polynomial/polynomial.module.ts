import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { PolynomialVaultTokenDefinitionsResolver } from './common/polynomial.vault.token-definition-resolver';
import { PolynomialContractFactory } from './contracts';
import { OptimismPolynomialVaultsContractPositionFetcher } from './optimism/polynomial.vaults.contract-position-fetcher';
import { OptimismPolynomialVaultsTokenFetcher } from './optimism/polynomial.vaults.token-fetcher';
import { PolynomialAppDefinition, POLYNOMIAL_DEFINITION } from './polynomial.definition';

@Register.AppModule({
  appId: POLYNOMIAL_DEFINITION.id,
  providers: [
    PolynomialAppDefinition,
    PolynomialContractFactory,
    PolynomialVaultTokenDefinitionsResolver,
    OptimismPolynomialVaultsContractPositionFetcher,
    OptimismPolynomialVaultsTokenFetcher,
  ],
})
export class PolynomialAppModule extends AbstractApp() {}
