import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { compact } from 'lodash';
import { sortBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition, Token } from '~position/position.interface';
import { TokenDependencySelector } from '~position/selectors/token-dependency-selector.interface';
import { BaseToken } from '~position/token.interface';
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
  priceDerivationWhitelist?: string[];
  resolveFactoryContract(opts: { address: string; network: Network }): T;
  resolvePoolContract(opts: { address: string; network: Network }): V;
  resolvePoolTokenAddresses: (opts: {
    appId: string;
    network: Network;
    factoryAddress: string;
    resolveFactoryContract(opts: { address: string; network: Network }): T;
    resolvePoolContract(opts: { address: string; network: Network }): V;
  }) => Promise<ResolvePoolTokenAddressesResponse>;
  resolveDerivedUnderlyingToken?(opts: {
    appId: string;
    network: Network;
    factoryAddress: string;
    tokenAddress: string;
    tokenDependencySelector: TokenDependencySelector;
    resolveFactoryContract(opts: { address: string; network: Network }): T;
    resolvePoolContract(opts: { address: string; network: Network }): V;
    resolvePoolUnderlyingTokenAddresses(opts: {
      multicall: IMulticallWrapper;
      poolContract: V;
    }): Promise<[string, string]>;
    resolvePoolReserves(opts: { multicall: IMulticallWrapper; poolContract: V }): Promise<[BigNumberish, BigNumberish]>;
  }): Promise<BaseToken | null>;
  resolvePoolVolumes?: (opts: {
    appId: string;
    network: Network;
    resolveFactoryContract(opts: { address: string; network: Network }): T;
    resolvePoolContract(opts: { address: string; network: Network }): V;
  }) => Promise<ResolvePoolVolumesResponse>;
  resolvePoolTokenSymbol(opts: { multicall: IMulticallWrapper; poolContract: V }): Promise<string>;
  resolvePoolTokenSupply(opts: { multicall: IMulticallWrapper; poolContract: V }): Promise<BigNumberish>;
  resolvePoolUnderlyingTokenAddresses(opts: {
    multicall: IMulticallWrapper;
    poolContract: V;
  }): Promise<[string, string]>;
  resolvePoolReserves(opts: { multicall: IMulticallWrapper; poolContract: V }): Promise<[BigNumberish, BigNumberish]>;
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
    fee = 0.3,
    minLiquidity = 0,
    hiddenTokens = [],
    blockedPools = [],
    resolveFactoryContract,
    resolvePoolContract,
    resolveDerivedUnderlyingToken,
    resolvePoolTokenAddresses,
    resolvePoolTokenSymbol,
    resolvePoolTokenSupply,
    resolvePoolUnderlyingTokenAddresses,
    resolvePoolReserves,
    resolveTokenDisplaySymbol = token => token.symbol,
    resolvePoolVolumes = async () => [],
  }: UniswapV2PoolTokenHelperParams<T, V>) {
    const multicall = this.appToolkit.getMulticall(network);
    const tokenSelector = this.appToolkit.getTokenDependencySelector({ tags: { network, context: appId } });

    const poolAddresses: ResolvePoolTokenAddressesResponse = await resolvePoolTokenAddresses({
      appId,
      network,
      factoryAddress,
      resolveFactoryContract,
      resolvePoolContract,
    });

    const poolVolumes: ResolvePoolVolumesResponse = await resolvePoolVolumes({
      appId,
      network,
      resolveFactoryContract,
      resolvePoolContract,
    }).catch(() => []);

    // NB: Token addresses are resolved first because of a Multicall batch size of 250
    // This allows DL to use its max batch size of 1000+ in the next loop
    const poolTokensWithAddresses = await Promise.all(
      poolAddresses.map(async address => {
        const poolContract = resolvePoolContract({ address, network });
        const [token0AddressRaw, token1AddressRaw] = await resolvePoolUnderlyingTokenAddresses({
          multicall,
          poolContract,
        });

        const token0Address = token0AddressRaw.toLowerCase();
        const token1Address = token1AddressRaw.toLowerCase();
        if (hiddenTokens.includes(token0Address) || hiddenTokens.includes(token1Address)) return null;

        return { address, token0Address, token1Address };
      }),
    );

    const poolTokens = await Promise.all(
      compact(poolTokensWithAddresses).map(async ({ address, token0Address, token1Address }) => {
        const type = ContractType.APP_TOKEN;
        const poolContract = resolvePoolContract({ address, network });

        const resolvedTokens = await Promise.all(
          [token0Address, token1Address].map(async tokenAddress => {
            const underlyingToken = await tokenSelector.getOne({ network, address: tokenAddress });

            if (underlyingToken) return underlyingToken;
            if (!resolveDerivedUnderlyingToken) return null;

            return resolveDerivedUnderlyingToken({
              appId,
              factoryAddress,
              network,
              tokenDependencySelector: tokenSelector,
              resolveFactoryContract,
              resolvePoolContract,
              resolvePoolReserves,
              resolvePoolUnderlyingTokenAddresses,
              tokenAddress,
            });
          }),
        );

        const tokens = compact(resolvedTokens);
        if (tokens.length !== resolvedTokens.length) return null;

        // Retrieve pool reserves and pool token supply
        const [symbol, supplyRaw, reservesRaw] = await Promise.all([
          resolvePoolTokenSymbol({ multicall, poolContract }),
          resolvePoolTokenSupply({ multicall, poolContract }),
          resolvePoolReserves({ multicall, poolContract }),
        ]);

        // Data Props
        const decimals = 18;
        const reservesBN = reservesRaw.map((r, i) => new BigNumber(r.toString()).div(10 ** tokens[i].decimals));
        const reserves = reservesBN.map(v => v.toNumber());
        const liquidity = tokens[0].price * reserves[0] + tokens[1].price * reserves[1];
        const reservePercentages = tokens.map((t, i) => reserves[i] * (t.price / liquidity));
        const supply = Number(supplyRaw) / 10 ** decimals;
        const price = liquidity / supply;
        const pricePerShare = reserves.map(r => r / supply);
        const volume = poolVolumes.find(v => v.poolAddress === address)?.volumeChangeUSD ?? 0;
        const volumeChangePercentage = poolVolumes.find(v => v.poolAddress === address)?.volumeChangePercentage ?? 0;
        const isBlocked = blockedPools.includes(address);
        const ratio = reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
        const projectedYearlyVolume = volume * 365;
        const apy = (projectedYearlyVolume * 100) / liquidity;

        // Display Props
        const label = `${resolveTokenDisplaySymbol(tokens[0])} / ${resolveTokenDisplaySymbol(tokens[1])}`;
        const secondaryLabel = ratio;
        const images = tokens.map(v => getImagesFromToken(v)).flat();
        const statsItems = [
          { label: 'Volume', value: buildDollarDisplayItem(volume) },
          { label: 'APY', value: buildPercentageDisplayItem(apy) },
          { label: 'Fee', value: buildPercentageDisplayItem(fee) },
          { label: 'Reserves', value: reserves.map(v => (v < 0.01 ? '<0.01' : v.toFixed(2))).join(' / ') },
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
          { label: 'Ratio', value: ratio },
        ];

        const poolToken: AppTokenPosition<UniswapV2PoolTokenDataProps> = {
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

    return sortBy(
      compact(poolTokens).filter(t => t.dataProps.liquidity > minLiquidity),
      t => -t!.dataProps.liquidity,
    );
  }
}
