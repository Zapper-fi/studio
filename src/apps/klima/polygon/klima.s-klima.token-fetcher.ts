import { Inject } from '@nestjs/common';
import axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Cache } from '~cache/cache.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import type {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { KlimaContractFactory, KlimaSKlima } from '../contracts';

export const API_BASE_URL = 'https://www.klimadao.finance/api';
export const EPOCH_INTERVAL = 11_520;
export const FALLBACK_BLOCK_RATE = 2.3;

export type SKlimaTokenDefinition = {
  address: string;
  underlyingAddress: string;
  reserve: number;
  apy: number;
};

@PositionTemplate()
export class PolygonKlimaSKlimaTokenFetcher extends AppTokenTemplatePositionFetcher<
  KlimaSKlima,
  DefaultAppTokenDataProps,
  SKlimaTokenDefinition
> {
  groupLabel = 'sKLIMA';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KlimaContractFactory) protected readonly contractFactory: KlimaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): KlimaSKlima {
    return this.contractFactory.klimaSKlima({ address, network: this.network });
  }

  async getAddresses({ definitions }: GetAddressesParams<SKlimaTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ definition }: GetUnderlyingTokensParams<KlimaSKlima, SKlimaTokenDefinition>) {
    return [{ address: definition.underlyingAddress, network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getLiquidity({
    definition,
    appToken: { tokens },
  }: GetDataPropsParams<KlimaSKlima, DefaultAppTokenDataProps, SKlimaTokenDefinition>) {
    return definition.reserve * tokens[0].price;
  }

  async getReserves({ definition }: GetDataPropsParams<KlimaSKlima, DefaultAppTokenDataProps, SKlimaTokenDefinition>) {
    return [definition.reserve];
  }

  async getApy({ definition }: GetDataPropsParams<KlimaSKlima, DefaultAppTokenDataProps, SKlimaTokenDefinition>) {
    return definition.apy * 100;
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const address = '0xb0c22d8d350c67420f06f48936654f567c73e8c8';
    const reserveAddress = '0x25d28a24ceb6f81015bb0b2007d795acac411b4d';
    const underlyingAddress = '0x4e78011ce80ee02d2c3e649fb657e45898257815';
    const distributorAddress = '0x4cc7584c3f8faabf734374ef129df17c3517e9cb';

    const sKlima = multicall.wrap(this.getContract(address));
    const distributor = multicall.wrap(
      this.contractFactory.klimaDistributor({ address: distributorAddress, network: this.network }),
    );
    const underlyingToken = multicall.wrap(
      this.contractFactory.erc20({ address: underlyingAddress, network: this.network }),
    );

    const [info, circulatingSupply, decimals, reserveRaw, blockRate] = await Promise.all([
      distributor.info(0),
      sKlima.circulatingSupply(),
      underlyingToken.decimals(),
      underlyingToken.balanceOf(reserveAddress),
      this.getBlockRate(),
    ]);
    const stakingReward = await distributor.nextRewardAt(info.rate);
    const stakingRebase = Number(stakingReward) / Number(circulatingSupply);
    const rebasesPerDay = 86_400 / (blockRate * EPOCH_INTERVAL);
    return [
      {
        address,
        underlyingAddress,
        reserve: Number(reserveRaw) / 10 ** decimals,
        apy: Math.pow(1 + stakingRebase, 365 * rebasesPerDay) - 1,
      },
    ];
  }

  @Cache({ key: `studio:klima:block-rate`, ttl: 5 * 60 })
  private async getBlockRate() {
    try {
      const { data } = await axios.get<{ blockRate30Day: string }>(`${API_BASE_URL}/block-rate`);
      return Number(data.blockRate30Day);
    } catch {
      return FALLBACK_BLOCK_RATE;
    }
  }
}
