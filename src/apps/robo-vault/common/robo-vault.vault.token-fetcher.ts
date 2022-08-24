import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
  PricePerShareStageParams,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';

import { RoboVault, RoboVaultContractFactory } from '../contracts';

import { RoboVaultApiClient } from './robo-vault.api.client';

export type RoboTokenDataProps = {
  apy: number;
  liquidity: number;
};

export abstract class RoboVaultVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  RoboVault,
  RoboTokenDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RoboVaultContractFactory) protected readonly contractFactory: RoboVaultContractFactory,
    @Inject(RoboVaultApiClient) protected readonly apiClient: RoboVaultApiClient,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RoboVault {
    return this.contractFactory.roboVault({ address, network: this.network });
  }

  async getAddresses() {
    const data = await this.apiClient.getCachedVaults(this.network);
    return data.map(v => v.addr.toLowerCase());
  }

  async getUnderlyingTokenAddresses({ contract }: UnderlyingTokensStageParams<RoboVault>) {
    return contract.token();
  }

  async getPricePerShare({ contract, appToken }: PricePerShareStageParams<RoboVault, RoboTokenDataProps>) {
    const pricePerShareRaw = await contract.pricePerShare();
    return Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;
  }

  async getDataProps({ appToken }: DataPropsStageParams<RoboVault, RoboTokenDataProps>): Promise<RoboTokenDataProps> {
    const liquidity = appToken.supply * appToken.price;
    const data = await this.apiClient.getCachedVaults(this.network);
    const apy = (data.find(v => v.addr.toLowerCase() === appToken.address)?.apy ?? 0) * 100;
    return { liquidity, apy };
  }
}
