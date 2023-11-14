import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { RoboVaultViemContractFactory } from '../contracts';
import { RoboVault } from '../contracts/viem';

import { RoboVaultApiClient } from './robo-vault.api.client';

export abstract class RoboVaultVaultTokenFetcher extends AppTokenTemplatePositionFetcher<RoboVault> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RoboVaultViemContractFactory) protected readonly contractFactory: RoboVaultViemContractFactory,
    @Inject(RoboVaultApiClient) protected readonly apiClient: RoboVaultApiClient,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.roboVault({ address, network: this.network });
  }

  async getAddresses() {
    const data = await this.apiClient.getCachedVaults(this.network);
    return data.map(v => v.addr.toLowerCase());
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<RoboVault>) {
    return [{ address: await contract.read.token(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<RoboVault>) {
    const pricePerShareRaw = await contract.read.pricePerShare();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;
    return [pricePerShare];
  }

  async getApy({ appToken }: GetDataPropsParams<RoboVault>) {
    const data = await this.apiClient.getCachedVaults(this.network);
    const apy = (data.find(v => v.addr.toLowerCase() === appToken.address)?.apy ?? 0) * 100;
    return apy;
  }
}
