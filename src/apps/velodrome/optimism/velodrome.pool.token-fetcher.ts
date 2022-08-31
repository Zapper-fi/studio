import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { VelodromeContractFactory, VelodromePool } from '../contracts';
import { VELODROME_DEFINITION } from '../velodrome.definition';

const appId = VELODROME_DEFINITION.id;
const groupId = VELODROME_DEFINITION.groups.pool.id;
const network = Network.OPTIMISM_MAINNET;

export interface VelodromeApiPairData {
  address: string;
  gauge_address: string;
  token0_address: string;
  token1_address: string;
  apr: number;
}

export type VelodromePoolTokenDataProps = {
  liquidity: number;
  reserves: number[];
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismVelodromePoolsTokenFetcher extends AppTokenTemplatePositionFetcher<
  VelodromePool,
  VelodromePoolTokenDataProps
> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeContractFactory) private readonly contractFactory: VelodromeContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): VelodromePool {
    return this.contractFactory.velodromePool({ address, network: this.network });
  }

  async getAddresses() {
    const { data } = await Axios.get<{ data: VelodromeApiPairData[] }>('https://api.velodrome.finance/api/v1/pairs');
    return data.data.map(pool => pool.address);
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<VelodromePool>) {
    return Promise.all([contract.token0(), contract.token1()]);
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<VelodromePool, DefaultDataProps>) {
    const [token0, token1] = appToken.tokens;
    const [reserve0, reserve1] = await Promise.all([contract.reserve0(), contract.reserve1()]);
    const reserves = [Number(reserve0) / 10 ** token0.decimals, Number(reserve1) / 10 ** token1.decimals];
    const pricePerShare = reserves.map(r => r / appToken.supply);
    return pricePerShare;
  }

  async getDataProps({ appToken }: GetDataPropsParams<VelodromePool, VelodromePoolTokenDataProps>) {
    const reserves = (appToken.pricePerShare as number[]).map(v => v * appToken.supply);
    const liquidity = appToken.price * appToken.supply;
    return { liquidity, reserves };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<VelodromePool, VelodromePoolTokenDataProps>): Promise<string> {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({ appToken }: GetDisplayPropsParams<VelodromePool, VelodromePoolTokenDataProps>) {
    const { liquidity, reserves } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    return reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<VelodromePool, VelodromePoolTokenDataProps>) {
    const { reserves, liquidity } = appToken.dataProps;
    const reservesDisplay = reserves.map(v => (v < 0.01 ? '<0.01' : v.toFixed(2))).join(' / ');

    return [
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'Reserves', value: reservesDisplay },
    ];
  }
}
