import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import _ from 'lodash';
import { keyBy, sortBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { UniswapFactory, UniswapPair } from '../contracts';

export type UniswapV2PoolTokenDataProps = {
  liquidity: number;
  fee: number;
  volume: number;
  volumeChangePercentage: number;
  isBlocked: boolean;
};

type ResolvePoolVolumesResponse = { poolAddress: string; volumeChangeUSD: number; volumeChangePercentage: number }[];

type ResolvePoolTokenAddressesResponse = string[];

export type UniswapV2PoolTokenHelperParams<T = UniswapFactory, V = UniswapPair> = {
  network: Network;
  appId: string;
  groupId: string;
  factoryAddress: string;
  fee?: number;
  minLiquidity?: number;
  hiddenTokens?: string[];
  blockedPools?: string[];
  appTokenDependencies?: AppGroupsDefinition[];
  resolveFactoryContract(opts: { address: string; network: Network }): T;
  resolvePoolContract(opts: { address: string; network: Network }): V;
  resolvePoolTokenAddresses: (opts: {
    appId: string;
    network: Network;
    factoryAddress: string;
    resolveFactoryContract(opts: { address: string; network: Network }): T;
    resolvePoolContract(opts: { address: string; network: Network }): V;
  }) => Promise<ResolvePoolTokenAddressesResponse>;
  resolvePoolVolumes?: (opts: {
    appId: string;
    network: Network;
    resolveFactoryContract(opts: { address: string; network: Network }): T;
    resolvePoolContract(opts: { address: string; network: Network }): V;
  }) => Promise<ResolvePoolVolumesResponse>;
  resolvePoolTokenSymbol(opts: { multicall: Multicall; poolContract: V }): Promise<string>;
  resolvePoolTokenSupply(opts: { multicall: Multicall; poolContract: V }): Promise<BigNumberish>;
  resolvePoolUnderlyingTokenAddresses(opts: { multicall: Multicall; poolContract: V }): Promise<[string, string]>;
  resolvePoolReserves(opts: { multicall: Multicall; poolContract: V }): Promise<[BigNumberish, BigNumberish]>;
  resolveTokenDisplayPrefix?: (symbol: string) => string;
  resolveTokenDisplaySymbol?: (token: Token) => string;
};

export class UniswapV2PoolTokenHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTokens<T = UniswapFactory, V = UniswapPair>({
    network,
    appId,
    groupId,
    factoryAddress,
    fee = 0.003,
    minLiquidity = 0,
    hiddenTokens = [],
    blockedPools = [],
    appTokenDependencies = [],
    resolveFactoryContract,
    resolvePoolContract,
    resolvePoolTokenAddresses,
    resolvePoolTokenSymbol,
    resolvePoolTokenSupply,
    resolvePoolUnderlyingTokenAddresses,
    resolvePoolReserves,
    resolveTokenDisplayPrefix = symbol => symbol,
    resolveTokenDisplaySymbol = token => token.symbol,
    resolvePoolVolumes = async () => [],
  }: UniswapV2PoolTokenHelperParams<T, V>) {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const appTokens = await this.appToolkit.getAppTokenPositions(...appTokenDependencies);
    const baseTokensByAddress = keyBy(baseTokens, p => p.address);
    const appTokensByAddress = keyBy(appTokens, p => p.address);

    const poolAddresses: ResolvePoolTokenAddressesResponse = await resolvePoolTokenAddresses({
      appId,
      network,
      factoryAddress,
      resolveFactoryContract,
      resolvePoolContract,
    }).catch(() => []);

    const poolVolumes: ResolvePoolVolumesResponse = await resolvePoolVolumes({
      appId,
      network,
      resolveFactoryContract,
      resolvePoolContract,
    }).catch(() => []);

    const poolStatsRaw = await Promise.all(
      poolAddresses.map(async address => {
        const type = ContractType.APP_TOKEN;
        const poolContract = resolvePoolContract({ address, network });
        const [token0AddressRaw, token1AddressRaw] = await resolvePoolUnderlyingTokenAddresses({
          multicall,
          poolContract,
        });

        const token0Address = token0AddressRaw.toLowerCase();
        const token1Address = token1AddressRaw.toLowerCase();
        if (hiddenTokens.includes(token0Address) || hiddenTokens.includes(token1Address)) return null;

        const token0 = appTokensByAddress[token0Address] ?? baseTokensByAddress[token0Address];
        const token1 = appTokensByAddress[token1Address] ?? baseTokensByAddress[token1Address];
        if (!token0 || !token1) return null;

        // Retrieve pool reserves and pool token supply
        const [symbol, supplyRaw, reservesRaw] = await Promise.all([
          resolvePoolTokenSymbol({ multicall, poolContract }),
          resolvePoolTokenSupply({ multicall, poolContract }),
          resolvePoolReserves({ multicall, poolContract }),
        ]);

        // Data Props
        const decimals = 18;
        const tokens = [token0, token1];
        const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** tokens[i].decimals);
        const liquidity = tokens[0].price * reserves[0] + tokens[1].price * reserves[1];
        const reservePercentages = tokens.map((t, i) => reserves[i] * (t.price / liquidity));
        const supply = Number(supplyRaw) / 10 ** decimals;
        const price = liquidity / supply;
        const pricePerShare = reserves.map(r => r / supply);
        const volume = poolVolumes.find(v => v.poolAddress === address)?.volumeChangeUSD ?? 0;
        const volumeChangePercentage = poolVolumes.find(v => v.poolAddress === address)?.volumeChangePercentage ?? 0;
        const isBlocked = blockedPools.includes(address);

        // Display Props
        const prefix = resolveTokenDisplayPrefix(symbol);
        const label = `${prefix} ${resolveTokenDisplaySymbol(token0)} / ${resolveTokenDisplaySymbol(token1)}`;
        const secondaryLabel = reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
        const images = tokens.map(v => getImagesFromToken(v)).flat();
        const statsItems = [
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
          { label: 'Volume', value: buildDollarDisplayItem(volume) },
          { label: 'Fee', value: buildPercentageDisplayItem(fee) },
        ];

        const poolToken: AppTokenPosition<UniswapV2PoolTokenDataProps> = {
          type,
          network,
          address,
          decimals,
          symbol,
          supply,
          appId,
          groupId,
          price,
          pricePerShare,
          tokens,

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },

          dataProps: {
            liquidity,
            fee,
            volume,
            volumeChangePercentage,
            isBlocked,
          },
        };

        return poolToken;
      }),
    );

    const poolStats = _.compact(poolStatsRaw);

    return sortBy(
      poolStats.filter(t => !!t && t.dataProps.liquidity > minLiquidity),
      t => -t!.dataProps.liquidity,
    );
  }
}
