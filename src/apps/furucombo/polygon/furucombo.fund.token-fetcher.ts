import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { DisplayProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetAddressesParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';
import { NETWORK_IDS } from '~types/network.interface';

import { FurucomboViemContractFactory } from '../contracts';
import { FurucomboFundShareToken } from '../contracts/viem';

interface FurucomboFund {
  address: string;
  name: string;
  token: {
    address: string;
    symbol: string;
    decimals: number;
    name: string;
  };
  stakingToken: {
    address: string;
    symbol: string;
    decimals: number;
    name: string;
  };
  liquidity: string;
  apy: string;
  tokenPrice: string;
  stakingTokenPrice: string;
  fundVault: string;
}

type FurucomboFundDefinition = {
  address: string;
  vaultAddress: string;
  stakingTokenAddress: string;
  name: string;
  apy: string;
  liquidity: string;
  price: string;
};

@PositionTemplate()
export class PolygonFurucomboFundTokenFetcher extends AppTokenTemplatePositionFetcher<
  FurucomboFundShareToken,
  DefaultAppTokenDataProps,
  FurucomboFundDefinition
> {
  groupLabel = 'Funds';
  minLiquidity = 0;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(FurucomboViemContractFactory) protected readonly contractFactory: FurucomboViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.furucomboFundShareToken({ address, network: this.network });
  }

  @CacheOnInterval({
    key: `studio:furucombo:fund:ethereum:funds`,
    timeout: 15 * 60 * 1000,
    failOnMissingData: false,
  })
  async getFurucomboFunds() {
    const { data } = await Axios.get<{ investables: FurucomboFund[] }>('https://api.furucombo.app/v1/investables', {
      params: { chainId: NETWORK_IDS[this.network], category: 'fund', protocol: 'furucombo' },
    });

    return data.investables;
  }

  async getDefinitions(): Promise<FurucomboFundDefinition[]> {
    const funds = await this.getFurucomboFunds();

    return funds.map(v => ({
      address: v.token.address.toLowerCase(),
      vaultAddress: v.fundVault.toLowerCase(),
      stakingTokenAddress: v.stakingToken.address.toLowerCase(),
      name: v.name,
      apy: v.apy,
      price: v.tokenPrice,
      liquidity: v.liquidity,
    }));
  }

  async getAddresses({ definitions }: GetAddressesParams<FurucomboFundDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<FurucomboFundShareToken, FurucomboFundDefinition>) {
    return [{ address: definition.stakingTokenAddress, network: this.network }];
  }

  async getPricePerShare({
    appToken,
    definition,
  }: GetPricePerShareParams<FurucomboFundShareToken, DefaultAppTokenDataProps, FurucomboFundDefinition>) {
    return [Number(definition.price) / appToken.tokens[0].price];
  }

  async getLiquidity({
    definition,
  }: GetDataPropsParams<FurucomboFundShareToken, DefaultAppTokenDataProps, FurucomboFundDefinition>) {
    return Number(definition.liquidity);
  }

  async getReserves({
    definition,
    appToken,
  }: GetDataPropsParams<FurucomboFundShareToken, DefaultAppTokenDataProps, FurucomboFundDefinition>) {
    return [Number(definition.liquidity) / appToken.tokens[0].price];
  }

  async getApy({
    definition,
  }: GetDataPropsParams<FurucomboFundShareToken, DefaultAppTokenDataProps, FurucomboFundDefinition>) {
    return Number(definition.apy) * 100;
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<FurucomboFundShareToken, DefaultAppTokenDataProps, FurucomboFundDefinition>): Promise<
    DisplayProps['label']
  > {
    return definition.name;
  }

  async getImages({
    appToken,
  }: GetDisplayPropsParams<FurucomboFundShareToken, DefaultAppTokenDataProps>): Promise<DisplayProps['images']> {
    return appToken.tokens.flatMap(t => getImagesFromToken(t));
  }
}
