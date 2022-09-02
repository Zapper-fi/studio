import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { DisplayProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';
import { Network, NETWORK_IDS } from '~types/network.interface';

import { FurucomboContractFactory, FurucomboFundShareToken } from '../contracts';
import { FURUCOMBO_DEFINITION, furucomboToken } from '../furucombo.definition';

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
}

type FurucomboFundDataProps = {
  apy: number;
  liquidity: number;
};

@Injectable()
export class PolygonFurucomboFundTokenFetcher extends AppTokenTemplatePositionFetcher<
  FurucomboFundShareToken,
  FurucomboFundDataProps
> {
  appId = FURUCOMBO_DEFINITION.id;
  groupId = FURUCOMBO_DEFINITION.groups.fund.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Furucombo Funds';
  furucomboFundMap: Record<string, FurucomboFund> = {};

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
      params: { chainId: NETWORK_IDS[network], category: 'fund', protocol: 'furucombo' },
    });
    return data.investables;
  }

  async getAddresses(): Promise<string[]> {
    const funds = await this.getFurucomboFunds();
    const addresses: string[] = [];
    for (const fund of funds) {
      addresses.push(fund.token.address);
      this.furucomboFundMap[fund.token.address] = fund;
    }

    return addresses;
  }

  async getUnderlyingTokenAddresses({ address }: GetUnderlyingTokensParams<FurucomboFundShareToken>) {
    return this.furucomboFundMap[address].stakingToken.address;
  }

  async getPricePerShare({
    contract,
  }: GetPricePerShareParams<FurucomboFundShareToken, FurucomboFundDataProps>): Promise<number | number[]> {
    const fund = this.furucomboFundMap[contract.address];
    return this.appToolkit
      .getBigNumber(fund.tokenPrice)
      .div(this.appToolkit.getBigNumber(fund.stakingTokenPrice))
      .toNumber();
  }

  async getDataProps({
    appToken,
  }: GetDataPropsParams<FurucomboFundShareToken, FurucomboFundDataProps>): Promise<FurucomboFundDataProps> {
    const fund = this.furucomboFundMap[appToken.address];

    return { apy: Number(fund.apy) * 100, liquidity: Number(fund.liquidity) };
  }

  async getLabel({
    appToken,
  }: GetDisplayPropsParams<FurucomboFundShareToken, FurucomboFundDataProps>): Promise<DisplayProps['label']> {
    return this.furucomboFundMap[appToken.address].name;
  }

  async getImages({
    appToken,
  }: GetDisplayPropsParams<FurucomboFundShareToken, FurucomboFundDataProps>): Promise<DisplayProps['images']> {
    return appToken.tokens.map(() => getTokenImg(furucomboToken.address, furucomboToken.network));
  }
}
