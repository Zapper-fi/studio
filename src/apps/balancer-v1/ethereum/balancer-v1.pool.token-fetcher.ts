import { Inject } from '@nestjs/common';
import DataLoader from 'dataloader';
import { gql } from 'graphql-request';
import { sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  DefaultAppTokenDefinition,
  GetDataPropsParams,
  GetDisplayPropsParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { BalancerPoolToken, BalancerV1ContractFactory } from '../contracts';

import { EthereumBalancerV1PoolSubgraphVolumeDataLoader } from './balancer-v1.volume.data-loader';

type GetAllPoolsData = {
  pools: {
    id: string;
  }[];
};

const getPoolsQuery = gql`
  query getPools($tsYesterday: Int) {
    pools(first: 1000, orderBy: liquidity, orderDirection: desc, where: { active: true, liquidity_gte: 10000 }) {
      id
    }
  }
`;

export type BalancerV1PoolTokenDataProps = DefaultAppTokenDataProps & {
  fee: number;
  volume: number;
  weight: number[];
};

@PositionTemplate()
export class EthereumBalancerV1PoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  BalancerPoolToken,
  BalancerV1PoolTokenDataProps
> {
  groupLabel = 'Pools';

  volumeDataLoader: DataLoader<string, number>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BalancerV1ContractFactory) protected readonly contractFactory: BalancerV1ContractFactory,
    @Inject(EthereumBalancerV1PoolSubgraphVolumeDataLoader)
    protected readonly volumeDataLoaderBuilder: EthereumBalancerV1PoolSubgraphVolumeDataLoader,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BalancerPoolToken {
    return this.contractFactory.balancerPoolToken({ address, network: this.network });
  }

  async getAddresses() {
    this.volumeDataLoader = this.volumeDataLoaderBuilder.getLoader();

    const poolsFromSubgraph = await this.appToolkit.helpers.theGraphHelper.requestGraph<GetAllPoolsData>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
      query: getPoolsQuery,
    });

    return poolsFromSubgraph.pools.map(v => v.id);
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<BalancerPoolToken>) {
    return contract.getCurrentTokens();
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<BalancerPoolToken>) {
    const reservesRaw = await Promise.all(appToken.tokens.map(t => contract.getBalance(t.address)));
    const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** appToken.tokens[i].decimals);
    const pricePerShare = reserves.map(r => r / appToken.supply);
    return pricePerShare;
  }

  async getReserves({ appToken }: GetDataPropsParams<BalancerPoolToken, BalancerV1PoolTokenDataProps>) {
    return (appToken.pricePerShare as number[]).map(pps => pps * appToken.supply);
  }

  async getLiquidity({ appToken }: GetDataPropsParams<BalancerPoolToken, BalancerV1PoolTokenDataProps>) {
    const reserves = (appToken.pricePerShare as number[]).map(pps => pps * appToken.supply);
    const liquidity = sum(reserves.map((r, i) => r * appToken.tokens[i].price));
    return liquidity;
  }

  async getApy({ appToken, contract }: GetDataPropsParams<BalancerPoolToken>) {
    const fee = (Number(await contract.getSwapFee()) / 10 ** 18) * 100;
    const volume = await this.volumeDataLoader.load(appToken.address);
    const yearlyFees = volume * fee * 365;
    const reserves = (appToken.pricePerShare as number[]).map(pps => pps * appToken.supply);
    const liquidity = sum(reserves.map((r, i) => r * appToken.tokens[i].price));
    const apy = yearlyFees / liquidity;
    return apy;
  }

  async getDataProps(params: GetDataPropsParams<BalancerPoolToken>) {
    const defaultDataProps = await super.getDataProps(params);

    const { appToken, contract } = params;
    const fee = (Number(await contract.getSwapFee()) / 10 ** 18) * 100;
    const weightsRaw = await Promise.all(appToken.tokens.map(t => contract.getNormalizedWeight(t.address)));
    const weight = weightsRaw.map(w => Number(w) / 10 ** 18);
    const volume = await this.volumeDataLoader.load(appToken.address);

    return { ...defaultDataProps, fee, volume, weight };
  }

  async getLabel({
    appToken,
  }: GetDisplayPropsParams<BalancerPoolToken, BalancerV1PoolTokenDataProps>): Promise<string> {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({
    appToken,
  }: GetDisplayPropsParams<BalancerPoolToken, BalancerV1PoolTokenDataProps, DefaultAppTokenDefinition>) {
    const { liquidity, reserves } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    return reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<BalancerPoolToken, BalancerV1PoolTokenDataProps>) {
    return [
      { label: 'Liquidity', value: buildDollarDisplayItem(appToken.dataProps.liquidity) },
      { label: 'Supply', value: buildNumberDisplayItem(appToken.supply) },
      { label: 'Volume', value: buildDollarDisplayItem(appToken.dataProps.volume) },
      { label: 'Fee', value: buildPercentageDisplayItem(appToken.dataProps.fee) },
      { label: 'Ratio', value: appToken.dataProps.weight.map(p => `${Math.round(p * 100)}%`).join(' / ') },
    ];
  }
}
