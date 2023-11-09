import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isMulticallUnderlyingError } from '~multicall/impl/multicall.ethers';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDataProps,
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { ReaperViemContractFactory } from '../contracts';
import { ReaperCrypt } from '../contracts/viem';

import { ReaperVaultCacheManager } from './reaper.vault.cache-manager';

type ReaperVaultDefinition = {
  name: string;
  address: string;
  underlyingAddress: string;
  apy: number;
};

export abstract class ReaperVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  ReaperCrypt,
  DefaultAppTokenDataProps,
  ReaperVaultDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ReaperViemContractFactory) protected readonly contractFactory: ReaperViemContractFactory,
    @Inject(ReaperVaultCacheManager) protected readonly cacheManager: ReaperVaultCacheManager,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.reaperCrypt({ address, network: this.network });
  }

  async getDefinitions() {
    return this.cacheManager.getCryptDefinitions(this.network);
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ definition }: GetUnderlyingTokensParams<ReaperCrypt, ReaperVaultDefinition>) {
    return [{ address: definition.underlyingAddress, network: this.network }];
  }

  async getPricePerShare({
    appToken,
    contract,
  }: GetPricePerShareParams<ReaperCrypt, DefaultAppTokenDataProps, ReaperVaultDefinition>) {
    const pricePerShareRaw = await contract.read.getPricePerFullShare().catch(err => {
      if (isMulticallUnderlyingError(err)) return 0;
      throw err;
    });

    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.decimals;
    return [pricePerShare];
  }

  async getLabel({ contract }: GetDisplayPropsParams<ReaperCrypt>) {
    return contract.name();
  }
}
