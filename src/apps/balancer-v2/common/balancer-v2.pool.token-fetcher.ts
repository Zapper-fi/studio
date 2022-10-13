import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { isEmpty } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetTokenPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BalancerPool, BalancerV2ContractFactory } from '../contracts';

import { PoolType } from './balancer-v2.pool-types';

type GetPoolsResponse = {
  pools: {
    address: string;
    poolType: PoolType;
    totalSwapVolume: string;
  }[];
};

const GET_POOLS_QUERY = gql`
  query getPools($minLiquidity: Int) {
    pools(first: 1000, skip: 0, orderBy: totalLiquidity, orderDirection: desc, where: { totalShares_gt: 0.01 }) {
      address
      poolType
      totalSwapVolume
    }
  }
`;

export type BalancerV2PoolTokenDataProps = DefaultAppTokenDataProps & {
  fee: number;
  weights: number[];
  volume: number;
  poolId: string;
  poolType: string;
};

export type BalancerV2PoolTokenDefinition = {
  poolType: string;
  address: string;
};

export abstract class BalancerV2PoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  BalancerPool,
  BalancerV2PoolTokenDataProps,
  BalancerV2PoolTokenDefinition
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

  async getDefinitions(): Promise<BalancerV2PoolTokenDefinition[]> {
    const poolsResponse = await this.appToolkit.helpers.theGraphHelper.requestGraph<GetPoolsResponse>({
      endpoint: this.subgraphUrl,
      query: GET_POOLS_QUERY,
    });

    return poolsResponse.pools.map(({ address, poolType }) => ({ address, poolType }));
  }

  async getAddresses({ definitions }: GetAddressesParams<BalancerV2PoolTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getSupply({
    address,
    contract,
    definition,
    multicall,
  }: GetTokenPropsParams<BalancerPool, BalancerV2PoolTokenDefinition>) {
    // Logic derived from https://github.com/balancer-labs/frontend-v2/blob/f22a7bf8f7adfbf1158178322ce9aa12034b5894/src/services/balancer/contracts/contracts/vault.ts#L86-L93
    if (
      definition.poolType === 'StablePhantom' ||
      definition.poolType === 'AaveLinear' ||
      definition.poolType === 'Linear'
    ) {
      const phantomPoolContract = this.contractFactory.balancerStablePhantomPool({ address, network: this.network });
      return multicall.wrap(phantomPoolContract).getVirtualSupply();
    }

    if (definition.poolType === 'ComposableStable') {
      const phantomPoolContract = this.contractFactory.balancerComposableStablePool({ address, network: this.network });
      return multicall.wrap(phantomPoolContract).getActualSupply();
    }

    return contract.totalSupply();
  }

  async getUnderlyingTokenAddresses({ address, contract, multicall }: GetUnderlyingTokensParams<BalancerPool>) {
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

  async getPricePerShare({ appToken, contract, multicall }: GetPricePerShareParams<BalancerPool>) {
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

  async getLiquidity({ appToken }: GetDataPropsParams<BalancerPool>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<BalancerPool>) {
    return (appToken.pricePerShare as number[]).map(v => v * appToken.supply);
  }

  async getApy(_params: GetDataPropsParams<BalancerPool>) {
    return 0;
  }

  async getDataProps(
    params: GetDataPropsParams<BalancerPool, BalancerV2PoolTokenDataProps, BalancerV2PoolTokenDefinition>,
  ): Promise<BalancerV2PoolTokenDataProps> {
    const defaultDataProps = await super.getDataProps(params);

    const { appToken, contract, definition } = params;
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
    const volume = 0; // TBD
    const poolType = definition.poolType;
    const weights = isEmpty(weightsRaw)
      ? appToken.tokens.map(() => 1 / appToken.tokens.length)
      : appToken.tokens.map((_, i) => Number(weightsRaw[i]) / 10 ** 18);

    return { ...defaultDataProps, poolId, poolType, fee, weights, volume };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<BalancerPool, BalancerV2PoolTokenDataProps>): Promise<string> {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({ appToken }: GetDisplayPropsParams<BalancerPool, BalancerV2PoolTokenDataProps>) {
    const { reserves, liquidity } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    return reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
  }
}
