import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { UmamiFinanceGlpVaultAddress } from '../common/umami-finance.constants';
import { UmamiFinanceContractFactory } from '../contracts';
import { UmamiFinanceGlpVault } from '../contracts/ethers/UmamiFinanceGlpVault';

export type UmamiFinanceGlpVaultAppTokenDefinition = {
  address: string;
  timelockedVaultAddress: string;
};

@PositionTemplate()
export class ArbitrumUmamiFinanceGlpVaultsTokenFetcher extends AppTokenTemplatePositionFetcher<
  UmamiFinanceGlpVault,
  DefaultAppTokenDataProps,
  UmamiFinanceGlpVaultAppTokenDefinition
> {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UmamiFinanceContractFactory) private readonly umamiFinanceContractFactory: UmamiFinanceContractFactory,
  ) {
    super(appToolkit);
    this.groupLabel = 'GLP Vaults';
  }

  getContract(_address: string): UmamiFinanceGlpVault {
    return this.umamiFinanceContractFactory.umamiFinanceGlpVault({ address: _address, network: this.network });
  }

  async getAddresses(_params: GetAddressesParams<UmamiFinanceGlpVaultAppTokenDefinition>): Promise<string[]> {
    return [
      UmamiFinanceGlpVaultAddress.GLP_USDC,
      UmamiFinanceGlpVaultAddress.GLP_WETH,
      UmamiFinanceGlpVaultAddress.GLP_WBTC,
      UmamiFinanceGlpVaultAddress.GLP_LINK,
      UmamiFinanceGlpVaultAddress.GLP_UNI,
    ];
  }

  async getUnderlyingTokenDefinitions({
    contract,
  }: GetUnderlyingTokensParams<UmamiFinanceGlpVault, UmamiFinanceGlpVaultAppTokenDefinition>): Promise<
    UnderlyingTokenDefinition[]
  > {
    const underlyingToken = await contract.asset();
    return [{ address: underlyingToken, network: this.network }];
  }

  async getPricePerShare({
    contract,
    appToken,
  }: GetPricePerShareParams<
    UmamiFinanceGlpVault,
    DefaultAppTokenDataProps,
    UmamiFinanceGlpVaultAppTokenDefinition
  >): Promise<number[]> {
    const pricePerShareRaw = await contract.pps();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.decimals;

    return [pricePerShare];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<UmamiFinanceGlpVault>): Promise<string> {
    return `GLP ${appToken.tokens[0].symbol}`;
  }
}
