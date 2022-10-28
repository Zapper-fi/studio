import { Inject, Injectable } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import AURA_DEFINITION from '../aura.definition';
import { AuraContractFactory } from '../contracts';

export type BalancerPool = {
  id: string;
  address: string;
  name: string;
  poolType: string;
  swapFee: number;
  symbol: string;
  tokensList: string;
  totalLiquidity: number;
  totalSwapVolume: number;
  totalSwapFee: number;
  totalShares: number;
  tokens: {
    address: string;
    symbol: string;
    decimals: number;
    balance: number;
    weight: number;
  }[];
};

type GetPoolResponse = {
  pool: {
    id: string;
    address: string;
    name: string;
    poolType: string;
    swapFee: string;
    symbol: string;
    tokensList: string;
    totalLiquidity: string;
    totalSwapVolume: string;
    totalSwapFee: string;
    totalShares: string;
    tokens: {
      address: string;
      symbol: string;
      decimals: number;
      balance: string;
      weight: string;
    }[];
  };
};

type GetBPTOutParams = { balancerPool: BalancerPool; maxAmountsIn: BigNumber[]; sender?: string; recipient?: string };

const GET_POOL_QUERY = gql`
  query getPool($id: ID!) {
    pool(id: $id) {
      id
      address
      name
      poolType
      swapFee
      symbol
      tokensList
      totalLiquidity
      totalSwapVolume
      totalSwapFee
      totalShares
      tokens {
        address
        symbol
        decimals
        balance
        weight
      }
    }
  }
`;

const BALANCER_VAULT = '0xba12222222228d8ba445958a75a0704d566bf2c8';
const network = Network.ETHEREUM_MAINNET;

@Injectable()
export class AuraBalancerPoolResolver {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory) private readonly contractFactory: AuraContractFactory,
  ) {}

  @Cache({
    key: (poolId: string) => `studio:${AURA_DEFINITION.id}:balancer-pools-${poolId}`,
    ttl: 15 * 60,
  })
  private async getBalancerPoolData(poolId: string) {
    const endpoint = `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2`;
    const { pool } = await this.appToolkit.helpers.theGraphHelper.request<GetPoolResponse>({
      endpoint,
      query: GET_POOL_QUERY,
      variables: { id: poolId },
    });

    return pool;
  }

  async getBalancerPool(poolId: string): Promise<BalancerPool> {
    const balancerPoolData = await this.getBalancerPoolData(poolId);

    const {
      id,
      address,
      name,
      poolType,
      swapFee,
      symbol,
      tokensList,
      totalLiquidity,
      totalSwapVolume,
      totalSwapFee,
      totalShares,
      tokens,
    } = balancerPoolData;

    return {
      id,
      address,
      name,
      poolType,
      swapFee: Number(swapFee),
      symbol,
      tokensList,
      totalLiquidity: Number(totalLiquidity),
      totalSwapVolume: Number(totalSwapVolume),
      totalSwapFee: Number(totalSwapFee),
      totalShares: Number(totalShares),
      tokens: tokens.map(({ address, balance, symbol, decimals, weight }) => ({
        address,
        balance: Number(balance),
        symbol,
        decimals,
        weight: Number(weight),
      })),
    };
  }

  async getBPTOut({
    balancerPool,
    maxAmountsIn,
    sender = BALANCER_VAULT,
    recipient = BALANCER_VAULT,
  }: GetBPTOutParams) {
    const { id, tokens } = balancerPool;

    const balancerHelpers = this.contractFactory.auraBalancerHelpers({
      address: '0x5addcca35b7a0d07c74063c48700c8590e87864e',
      network,
    });

    const joinPoolRequestStruct = {
      assets: tokens.map(token => token.address),
      maxAmountsIn,
      userData: ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256[]', 'uint256'], [1, maxAmountsIn, 0]),
      fromInternalBalance: false,
    };

    return balancerHelpers.callStatic.queryJoin(id, sender, recipient, joinPoolRequestStruct);
  }
}
