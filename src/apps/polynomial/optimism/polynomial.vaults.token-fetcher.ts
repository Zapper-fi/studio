import { Inject } from '@nestjs/common';
import 'moment-duration-format';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { PolynomialVaultTokenDefinitionsResolver } from '../common/polynomial.vault.token-definition-resolver';
import { PolynomialContractFactory, PolynomialVaultToken } from '../contracts';

export type PolynomialVaultTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class OptimismPolynomialVaultsTokenFetcher extends AppTokenTemplatePositionFetcher<
  PolynomialVaultToken,
  DefaultAppTokenDataProps,
  PolynomialVaultTokenDefinition
> {
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PolynomialContractFactory) protected readonly contractFactory: PolynomialContractFactory,
    @Inject(PolynomialVaultTokenDefinitionsResolver)
    protected readonly vaultTokenDefinitionResolver: PolynomialVaultTokenDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PolynomialVaultToken {
    return this.contractFactory.polynomialVaultToken({ network: this.network, address });
  }

  async getDefinitions(): Promise<PolynomialVaultTokenDefinition[]> {
    const vaultDefinitonsRaw = await this.vaultTokenDefinitionResolver.getVaultDefinitions(this.network);

    const definitions = vaultDefinitonsRaw.map(vault => {
      return {
        address: vault.tokenAddress,
        underlyingTokenAddress: vault.underlyingTokenAddress,
      };
    });

    return definitions;
  }

  async getAddresses({ definitions }: GetAddressesParams<PolynomialVaultTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<PolynomialVaultToken, PolynomialVaultTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  // todo figure out price per share
  async getPricePerShare() {
    return 1;
  }
}
