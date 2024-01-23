import { Abi, GetContractReturnType, PublicClient } from 'viem';

import { ViemMulticallDataLoader } from '~multicall';
import { AppTokenPosition } from '~position/position.interface';
import { TokenDependencySelector } from '~position/selectors/token-dependency-selector.interface';
import { Network } from '~types/network.interface';

export type DefaultAppTokenDefinition = {
  address: string;
};

export type DefaultAppTokenDataProps = {
  liquidity: number;
  reserves: number[];
  apy: number;
  isDebt: boolean;
};

export type UnderlyingTokenDefinition = {
  address: string;
  network: Network;
  tokenId?: string;
};

// PHASE 1: List addresses and definitions
export type GetDefinitionsParams = {
  multicall: ViemMulticallDataLoader;
  tokenLoader: TokenDependencySelector;
};

export type GetAddressesParams<R = DefaultAppTokenDefinition> = {
  definitions: R[];
  multicall: ViemMulticallDataLoader;
};

// PHASE 2: Build position objects
type PositionBuilderContext<T extends Abi, R = DefaultAppTokenDefinition> = {
  multicall: ViemMulticallDataLoader;
  tokenLoader: TokenDependencySelector;
  address: string;
  definition: R;
  contract: GetContractReturnType<T, PublicClient>;
};

type PositionBuilderContextWithAppToken<
  T extends Abi,
  V = DefaultAppTokenDataProps,
  R = DefaultAppTokenDefinition,
  K extends keyof AppTokenPosition = keyof AppTokenPosition,
> = PositionBuilderContext<T, R> & {
  appToken: Omit<AppTokenPosition<V>, K>;
};

export type GetUnderlyingTokensParams<T extends Abi, R = DefaultAppTokenDefinition> = PositionBuilderContext<T, R>;

export type GetTokenPropsParams<
  T extends Abi,
  V = DefaultAppTokenDataProps,
  R = DefaultAppTokenDefinition,
> = PositionBuilderContextWithAppToken<
  T,
  V,
  R,
  'symbol' | 'decimals' | 'supply' | 'pricePerShare' | 'price' | 'dataProps' | 'displayProps'
>;

export type GetPricePerShareParams<
  T extends Abi,
  V = DefaultAppTokenDataProps,
  R = DefaultAppTokenDefinition,
> = PositionBuilderContextWithAppToken<T, V, R, 'pricePerShare' | 'price' | 'dataProps' | 'displayProps'>;

export type GetPriceParams<
  T extends Abi,
  V = DefaultAppTokenDataProps,
  R = DefaultAppTokenDefinition,
> = PositionBuilderContextWithAppToken<T, V, R, 'price' | 'dataProps' | 'displayProps'>;

export type GetDataPropsParams<
  T extends Abi,
  V = DefaultAppTokenDataProps,
  R = DefaultAppTokenDefinition,
> = PositionBuilderContextWithAppToken<T, V, R, 'dataProps' | 'displayProps'>;

export type GetDisplayPropsParams<
  T extends Abi,
  V = DefaultAppTokenDataProps,
  R = DefaultAppTokenDefinition,
> = PositionBuilderContextWithAppToken<T, V, R, 'displayProps'>;
