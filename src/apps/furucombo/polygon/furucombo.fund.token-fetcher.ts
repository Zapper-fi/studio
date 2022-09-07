import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
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
} from '~position/template/app-token.template.types';
import { Network, NETWORK_IDS } from '~types/network.interface';

import { FurucomboContractFactory, FurucomboFundShareToken } from '../contracts';
import { FURUCOMBO_DEFINITION } from '../furucombo.definition';

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

type FurucomboFundDataProps = {
  apy: number;
  liquidity: number;
};

type FurucomboFundDefinition = {
  address: string;
  vaultAddress: string;
  stakingTokenAddress: string;
  name: string;
  apy: string;
  liquidity: string;
  price: string;
};

const appId = FURUCOMBO_DEFINITION.id;
const groupId = FURUCOMBO_DEFINITION.groups.fund.id;
const network = Network.POLYGON_MAINNET;

@Injectable()
export class PolygonFurucomboFundTokenFetcher extends AppTokenTemplatePositionFetcher<
  FurucomboFundShareToken,
  FurucomboFundDataProps,
  FurucomboFundDefinition
> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Funds';
  minLiquidity = 0;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(FurucomboContractFactory) protected readonly contractFactory: FurucomboContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): FurucomboFundShareToken {
    return this.contractFactory.furucomboFundShareToken({ address, network: this.network });
  }

  @CacheOnInterval({
    key: `studio:${appId}:${groupId}:${network}:funds`,
    timeout: 15 * 60 * 1000,
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

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<FurucomboFundShareToken, FurucomboFundDefinition>) {
    return definition.stakingTokenAddress;
  }

  async getPricePerShare({
    appToken,
    definition,
  }: GetPricePerShareParams<FurucomboFundShareToken, FurucomboFundDataProps, FurucomboFundDefinition>) {
    return Number(definition.price) / appToken.tokens[0].price;
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<
    FurucomboFundShareToken,
    FurucomboFundDataProps,
    FurucomboFundDefinition
  >): Promise<FurucomboFundDataProps> {
    return { apy: Number(definition.apy) * 100, liquidity: Number(definition.liquidity) };
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<FurucomboFundShareToken, FurucomboFundDataProps, FurucomboFundDefinition>): Promise<
    DisplayProps['label']
  > {
    return definition.name;
  }

  async getImages({
    appToken,
  }: GetDisplayPropsParams<FurucomboFundShareToken, FurucomboFundDataProps>): Promise<DisplayProps['images']> {
    return appToken.tokens.flatMap(t => getImagesFromToken(t));
  }
}
