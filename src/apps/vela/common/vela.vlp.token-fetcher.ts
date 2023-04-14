import { Inject } from '@nestjs/common';
import axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';
import { NETWORK_IDS } from '~types';

import { VelaContractFactory } from '../contracts';

interface VelaGetVlpAprResponse {
  VLP_APR: number;
  VELA_APR: number;
  TOTAL_APR: number;
}

export abstract class VelaVlpTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'vlp';

  abstract get vlpAddress(): string | Promise<string>;
  abstract get usdcAddress(): string | Promise<string>;
  abstract get velaVaultAddress(): string | Promise<string>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelaContractFactory) private readonly velaContractFactory: VelaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.appToolkit.globalContracts.erc20({
      address,
      network: this.network,
    });
  }

  async getAddresses(): Promise<string[]> {
    const vlpAddress = await this.vlpAddress;
    return [vlpAddress];
  }

  async getUnderlyingTokenDefinitions(): Promise<UnderlyingTokenDefinition[]> {
    const usdcAddress = await this.usdcAddress;
    return [{ address: usdcAddress, network: this.network }];
  }

  async getApy(): Promise<number> {
    try {
      const {
        data: { VLP_APR },
      } = await axios.get<VelaGetVlpAprResponse>(
        `https://vela-public-server-prod-qxq2l.ondigitalocean.app/market/vlp-apr/${NETWORK_IDS[this.network]}`,
      );
      return VLP_APR;
    } catch {
      return 0;
    }
  }

  async getPricePerShare({
    multicall,
  }: GetPricePerShareParams<Erc20, DefaultAppTokenDataProps, DefaultAppTokenDefinition>): Promise<number[]> {
    const velaVaultAddress = await this.velaVaultAddress;
    const velaVault = multicall.wrap(
      this.velaContractFactory.velaVault({
        address: velaVaultAddress,
        network: this.network,
      }),
    );
    const [vlpPrice, basisPointsDivisor] = await Promise.all([
      velaVault.getVLPPrice(),
      velaVault.BASIS_POINTS_DIVISOR(),
    ]);
    const pricePerShare = Number(vlpPrice) / Number(basisPointsDivisor);
    return [pricePerShare];
  }
}
