import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { isUnderlyingDenominated } from '../common/formatters';
import { PolynomialApiHelper } from '../common/polynomial.api';
import { PolynomialViemContractFactory } from '../contracts';
import { PolynomialVaultToken } from '../contracts/viem';

type PolynomialCallSellingVaultTokenDefinition = {
  address: string;
  vaultAddress: string;
};

@PositionTemplate()
export class OptimismPolynomialCallSellingVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  PolynomialVaultToken,
  DefaultAppTokenDataProps,
  PolynomialCallSellingVaultTokenDefinition
> {
  groupLabel = 'Call Selling Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PolynomialViemContractFactory) protected readonly contractFactory: PolynomialViemContractFactory,
    @Inject(PolynomialApiHelper) protected readonly apiHelper: PolynomialApiHelper,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.polynomialVaultToken({ address, network: this.network });
  }

  async getDefinitions(): Promise<PolynomialCallSellingVaultTokenDefinition[]> {
    const vaults = await this.apiHelper.getVaults();
    const coveredCallVaults = vaults.filter(vault => isUnderlyingDenominated(vault.vaultId));
    return coveredCallVaults.map(v => ({
      address: v.tokenAddress.toLowerCase(),
      vaultAddress: v.vaultAddress.toLowerCase(),
    }));
  }

  async getAddresses({ definitions }: GetAddressesParams<PolynomialCallSellingVaultTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
    multicall,
  }: GetUnderlyingTokensParams<PolynomialVaultToken, PolynomialCallSellingVaultTokenDefinition>) {
    const vaultContract = this.contractFactory.polynomialCoveredCall({
      address: definition.vaultAddress,
      network: this.network,
    });

    return [{ address: await multicall.wrap(vaultContract).read.UNDERLYING(), network: this.network }];
  }

  async getPricePerShare({
    definition,
    multicall,
    appToken,
  }: GetPricePerShareParams<
    PolynomialVaultToken,
    DefaultAppTokenDataProps,
    PolynomialCallSellingVaultTokenDefinition
  >) {
    const vaultContract = this.contractFactory.polynomialCoveredCall({
      address: definition.vaultAddress,
      network: this.network,
    });

    const pricePerShareRaw = await multicall.wrap(vaultContract).read.getTokenPrice();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;

    return [pricePerShare];
  }
}
