import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { YearnContractFactory, YearnVaultV2 } from '../contracts';

import { YearnVaultTokenDefinitionsResolver } from './yearn.vault.token-definitions-resolver';

export type YearnVaultAppTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
  apy: number;
};

export abstract class YearnVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  YearnVaultV2,
  DefaultAppTokenDataProps,
  YearnVaultAppTokenDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YearnContractFactory) protected readonly contractFactory: YearnContractFactory,
    @Inject(YearnVaultTokenDefinitionsResolver) protected readonly vaultResolver: YearnVaultTokenDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YearnVaultV2 {
    return this.contractFactory.yearnVaultV2({ address, network: this.network });
  }

  async getDefinitions(): Promise<YearnVaultAppTokenDefinition[]> {
    return this.vaultResolver.getVaultDefinitions(this.network);
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<YearnVaultV2, YearnVaultAppTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<YearnVaultV2>) {
    const pricePerShareRaw = await contract.pricePerShare().catch(err => {
      if (isMulticallUnderlyingError(err)) return 0;
      throw err;
    });

    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.decimals;
    return [pricePerShare];
  }

  async getApy({
    definition,
  }: GetDataPropsParams<YearnVaultV2, DefaultAppTokenDataProps, YearnVaultAppTokenDefinition>) {
    return definition.apy;
  }
}
