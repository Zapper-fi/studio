import { Inject, Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';
import _ from 'lodash';
import { isEmpty } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken, getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { BalancerV2ContractFactory } from '../contracts';

import { PoolType } from './balancer-v2.pool-types';

export enum BalancerV2PoolLabelStrategy {
  TOKEN_SYMBOLS = 'token-symbols',
  POOL_NAME = 'pool-name',
}

type BalancerV2PoolTokenDataProps = {
  liquidity: number;
  fee: number;
  reserves: number[];
  weights: number[];
  volume: number;
  poolId: string;
};

type GetBalancerV2PoolTokensParams = {
  network: Network;
  appId: string;
  groupId: string;
  appTokenDependencies?: AppGroupsDefinition[];
  vaultAddress: string;
  minLiquidity?: number;
  resolvePoolTokenAddresses: (opts: {
    appId: string;
    network: Network;
  }) => Promise<{ address: string; volume: number; poolType: PoolType }[]>;
  resolvePoolLabelStrategy?: () => BalancerV2PoolLabelStrategy;
};

type PoolTokenData = {
  address: string;
  volume: number;
  poolType: PoolType;
  tokenAddresses: string[];
  reservesRaw: BigNumber[];
};

@Injectable()
export class BalancerV2PoolTokensHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ContractFactory) private readonly contractFactory: BalancerV2ContractFactory,
  ) {}

  async getPositionsForPoolData(
    poolTokenData: PoolTokenData[],
    basePools: AppTokenPosition[],
    opts: GetBalancerV2PoolTokensParams,
  ) {
    const {
      appId,
      groupId,
      network,
      minLiquidity = 0,
      appTokenDependencies = [],
      resolvePoolLabelStrategy = () => BalancerV2PoolLabelStrategy.TOKEN_SYMBOLS,
    } = opts;

    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...appTokenDependencies);

    const pools = await Promise.all(
      poolTokenData.map(async ({ address, volume, poolType, tokenAddresses, reservesRaw }) => {
        const type = ContractType.APP_TOKEN;
        const poolContract = this.contractFactory.balancerPool({ network, address });
        const poolId = await multicall.wrap(poolContract).getPoolId();

        // Resolve underlying tokens
        const dependencies = [...basePools, ...appTokens, ...baseTokens];
        const maybeTokens = tokenAddresses.map(tokenAddress => dependencies.find(p => p.address === tokenAddress));
        const tokens = _.compact(maybeTokens);
        if (tokens.length !== maybeTokens.length) return null;

        const reserves = tokens.map((t, i) => Number(reservesRaw[i]) / 10 ** t.decimals);
        const liquidity = tokens.reduce((acc, v, i) => acc + v.price * reserves[i], 0);
        if (liquidity < minLiquidity) return null;

        const supplyRaw =
          poolType === PoolType.AaveLinear || poolType === PoolType.StablePhantom
            ? await multicall.wrap(this.contractFactory.balancerAaveLinearPool({ address, network })).getVirtualSupply()
            : await multicall.wrap(poolContract).totalSupply();

        const [decimals, symbol, feeRaw, weightsRaw] = await Promise.all([
          multicall.wrap(poolContract).decimals(),
          multicall.wrap(poolContract).symbol(),
          multicall
            .wrap(poolContract)
            .getSwapFeePercentage()
            .catch(() => '100000000000000000'),
          multicall
            .wrap(poolContract)
            .getNormalizedWeights()
            .catch(() => []),
        ]);
        // Data Props
        const supply = Number(supplyRaw) / 10 ** decimals;
        const fee = Number(feeRaw) / 10 ** 18;
        const price = liquidity / supply;
        const pricePerShare = reserves.map(r => r / supply);
        const reservePercentages = tokens.map((t, i) => reserves[i] * (t.price / liquidity));
        const weights = tokens.map((_, i) =>
          isEmpty(weightsRaw) ? 1 / tokens.length : Number(weightsRaw[i]) / 10 ** 18,
        );

        // Display Props
        const labelStrategy = resolvePoolLabelStrategy();
        const label =
          labelStrategy === BalancerV2PoolLabelStrategy.POOL_NAME
            ? await multicall.wrap(poolContract).name()
            : tokens.map(v => getLabelFromToken(v)).join(' / ');
        const ratio = reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
        const secondaryLabel = ratio;
        const images = tokens.map(v => getTokenImg(v.address, network));

        const token: AppTokenPosition<BalancerV2PoolTokenDataProps> = {
          type,
          address,
          network,
          appId,
          groupId,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            poolId,
            fee,
            liquidity,
            reserves,
            weights,
            volume,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems: [
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(liquidity),
              },
              {
                label: 'Ratio',
                value: ratio,
              },
            ],
          },
        };

        return token;
      }),
    );

    return _.compact(pools);
  }

  async getPositions(opts: GetBalancerV2PoolTokensParams) {
    const { appId, network, vaultAddress, resolvePoolTokenAddresses } = opts;
    const multicall = this.appToolkit.getMulticall(network);
    const poolTokenData = await resolvePoolTokenAddresses({ appId, network });
    const vaultContract = this.contractFactory.balancerVault({ network, address: vaultAddress });

    const poolTokenDataWithReserves = await Promise.all(
      poolTokenData.map(async ({ address, volume, poolType }) => {
        const poolContract = this.contractFactory.balancerPool({ network, address });
        const poolId = await multicall.wrap(poolContract).getPoolId();
        const poolTokenData = await multicall.wrap(vaultContract).getPoolTokens(poolId);
        const tokenAddressesUnfiltered = poolTokenData.tokens.map(v => v.toLowerCase());
        const reservesRawUnfiltered = poolTokenData.balances;

        // Remove redundancies
        const redundantIndex = tokenAddressesUnfiltered.findIndex(v => v === address);
        const tokenAddresses = tokenAddressesUnfiltered.filter((_, i) => i !== redundantIndex);
        const reservesRaw = reservesRawUnfiltered.filter((_, i) => i !== redundantIndex);

        return { address, volume, poolType, tokenAddresses, reservesRaw };
      }),
    );

    const [basePoolData, metaPoolData] = _.partition(poolTokenDataWithReserves, t => {
      const poolTokenAddresses = poolTokenDataWithReserves.map(v => v.address);
      const isBasePool = _.intersection(t.tokenAddresses, poolTokenAddresses).length === 0;
      return isBasePool;
    });

    const basePools = await this.getPositionsForPoolData(basePoolData, [], opts);
    const metaPools = await this.getPositionsForPoolData(metaPoolData, basePools, opts);
    return [...basePools, ...metaPools];
  }
}
