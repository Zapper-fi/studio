import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { isEmpty } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { DefaultDataProps } from '~position/display.interface';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
  DisplayPropsStageParams,
  PricePerShareStageParams,
  TokenPropsStageParams,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';

import { BalancerPool, BalancerV2ContractFactory } from '../contracts';
import { PoolType } from '../helpers/balancer-v2.pool-types';

type GetPoolsResponse = {
  pools: {
    address: string;
    poolType: PoolType;
    totalSwapVolume: string;
  }[];
};

const GET_POOLS_QUERY = gql`
  query getPools($minLiquidity: Int) {
    pools(first: 250, skip: 0, orderBy: totalLiquidity, orderDirection: desc, where: { totalShares_gt: 0.01 }) {
      address
      poolType
      totalSwapVolume
    }
  }
`;

export type BalancerV2PoolTokenDataProps = {
  liquidity: number;
  fee: number;
  reserves: number[];
  weights: number[];
  volume: number;
  poolId: string;
};

export abstract class BalancerV2PoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  BalancerPool,
  BalancerV2PoolTokenDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ContractFactory) protected readonly contractFactory: BalancerV2ContractFactory,
  ) {
    super(appToolkit);
  }

  abstract subgraphUrl: string;
  abstract vaultAddress: string;

  getContract(address: string) {
    return this.contractFactory.balancerPool({ address, network: this.network });
  }

  async getAddresses() {
    const poolsResponse = await this.appToolkit.helpers.theGraphHelper.requestGraph<GetPoolsResponse>({
      endpoint: this.subgraphUrl,
      query: GET_POOLS_QUERY,
    });

    return poolsResponse.pools.map(v => v.address);
  }

  async getSupply({ address, contract, multicall }: TokenPropsStageParams<BalancerPool>) {
    const supply = await contract.totalSupply();
    if (supply.toHexString() !== '0xffffffffffffffffffffffffffff') return supply;

    // Linear and Phantom pools are minted with maximum supply; use the virtual supply instead
    const _phantomPoolContract = this.contractFactory.balancerAaveLinearPool({ address, network: this.network });
    const phantomPoolContract = multicall.wrap(_phantomPoolContract);
    return phantomPoolContract.getVirtualSupply();
  }

  async getUnderlyingTokenAddresses({ address, contract, multicall }: UnderlyingTokensStageParams<BalancerPool>) {
    const _vault = this.contractFactory.balancerVault({ address: this.vaultAddress, network: this.network });
    const vault = multicall.wrap(_vault);

    const poolId = await contract.getPoolId();
    const poolTokens = await vault.getPoolTokens(poolId);

    // "Phantom" pools emit their own token address as an underlying token; filter this out
    const underlyingTokenAddresses = poolTokens.tokens.map(v => v.toLowerCase());
    const redundantIndex = underlyingTokenAddresses.findIndex(v => v === address);
    const tokenAddresses = underlyingTokenAddresses.filter((_, i) => i !== redundantIndex);
    return tokenAddresses;
  }

  async getPricePerShare({ appToken, contract, multicall }: PricePerShareStageParams<BalancerPool, DefaultDataProps>) {
    const _vault = this.contractFactory.balancerVault({ address: this.vaultAddress, network: this.network });
    const vault = multicall.wrap(_vault);

    const poolId = await contract.getPoolId();
    const poolTokens = await vault.getPoolTokens(poolId);

    // "Phantom" pools emit their own token address as an underlying token; filter this out
    const underlyingTokenAddresses = poolTokens.tokens.map(v => v.toLowerCase());
    const redundantIndex = underlyingTokenAddresses.findIndex(v => v === appToken.address);
    const reservesRaw = poolTokens.balances.filter((_, i) => i !== redundantIndex);
    const reserves = reservesRaw.map((v, i) => Number(v) / 10 ** appToken.tokens[i].decimals);
    return reserves.map(r => r / appToken.supply);
  }

  async getDataProps({
    appToken,
    contract,
  }: DataPropsStageParams<BalancerPool, BalancerV2PoolTokenDataProps>): Promise<BalancerV2PoolTokenDataProps> {
    const [poolId, feeRaw, weightsRaw] = await Promise.all([
      contract.getPoolId(),
      contract.getSwapFeePercentage().catch(err => {
        if (isMulticallUnderlyingError(err)) return '100000000000000000';
        throw err;
      }),
      contract.getNormalizedWeights().catch(err => {
        if (isMulticallUnderlyingError(err)) return [];
        throw err;
      }),
    ]);

    const fee = Number(feeRaw) / 10 ** 18;
    const reserves = (appToken.pricePerShare as number[]).map(v => v * appToken.supply);
    const liquidity = appToken.supply * appToken.price;
    const volume = 0; // TBD
    const weights = isEmpty(weightsRaw)
      ? appToken.tokens.map(() => 1 / appToken.tokens.length)
      : appToken.tokens.map((_, i) => Number(weightsRaw[i]) / 10 ** 18);

    return {
      poolId,
      fee,
      liquidity,
      reserves,
      weights,
      volume,
    };
  }

  async getLabel({ appToken }: DisplayPropsStageParams<BalancerPool, BalancerV2PoolTokenDataProps>): Promise<string> {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({ appToken }: DisplayPropsStageParams<BalancerPool, BalancerV2PoolTokenDataProps>) {
    const { reserves, liquidity } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    return reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
  }
}
