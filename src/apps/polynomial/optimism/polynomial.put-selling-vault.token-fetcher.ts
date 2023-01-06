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

import { PolynomialContractFactory, PolynomialVaultToken } from '../contracts';
import { isUnderlyingDenominated } from '../helpers/formatters';
import { PolynomialApiHelper } from '../helpers/polynomial.api';

type PolynomialPutSellingVaultTokenDefinition = {
  address: string;
  vaultAddress: string;
};

@PositionTemplate()
export class OptimismPolynomialPutSellingVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  PolynomialVaultToken,
  DefaultAppTokenDataProps,
  PolynomialPutSellingVaultTokenDefinition
> {
  groupLabel = 'Put Selling Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PolynomialContractFactory) protected readonly contractFactory: PolynomialContractFactory,
    @Inject(PolynomialApiHelper) protected readonly apiHelper: PolynomialApiHelper,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PolynomialVaultToken {
    return this.contractFactory.polynomialVaultToken({ address, network: this.network });
  }

  async getDefinitions(): Promise<PolynomialPutSellingVaultTokenDefinition[]> {
    const vaults = await this.apiHelper.getVaults();
    const putSellingVaults = vaults.filter(vault => !isUnderlyingDenominated(vault.vaultId));
    return putSellingVaults.map(v => ({
      address: v.tokenAddress.toLowerCase(),
      vaultAddress: v.vaultAddress.toLowerCase(),
    }));
  }

  async getAddresses({ definitions }: GetAddressesParams<PolynomialPutSellingVaultTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
    multicall,
  }: GetUnderlyingTokensParams<PolynomialVaultToken, PolynomialPutSellingVaultTokenDefinition>) {
    const vaultContract = this.contractFactory.polynomialPutSelling({
      address: definition.vaultAddress,
      network: this.network,
    });

    return [{ address: await multicall.wrap(vaultContract).SUSD(), network: this.network }];
  }

  async getPricePerShare({
    definition,
    multicall,
    appToken,
  }: GetPricePerShareParams<PolynomialVaultToken, DefaultAppTokenDataProps, PolynomialPutSellingVaultTokenDefinition>) {
    const vaultContract = this.contractFactory.polynomialPutSelling({
      address: definition.vaultAddress,
      network: this.network,
    });

    const pricePerShareRaw = await multicall.wrap(vaultContract).getTokenPrice();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;

    return [pricePerShare];
  }
}
