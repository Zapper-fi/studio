import { IMulticallWrapper } from '~multicall/multicall.interface';
import { AppTokenPosition } from '~position/position.interface';
import { TokenDependencySelector } from '~position/selectors/token-dependency-selector.interface';

export type DefaultAppTokenDefinition = {
  address: string;
};

export type DefaultAppTokenDataProps = {
  liquidity: number;
  reserves: number[];
  apy: number;
};

// PHASE 1: List addresses and definitions
export type GetDefinitionsParams = {
  multicall: IMulticallWrapper;
  tokenLoader: TokenDependencySelector;
};

export type GetAddressesParams<R = DefaultAppTokenDefinition> = {
  definitions: R[];
  multicall: IMulticallWrapper;
};

// PHASE 2: Build position objects
type PositionBuilderContext<T, R = DefaultAppTokenDefinition> = {
  multicall: IMulticallWrapper;
  tokenLoader: TokenDependencySelector;
  address: string;
  definition: R;
  contract: T;
};

type PositionBuilderContextWithAppToken<
  T,
  V = DefaultAppTokenDataProps,
  R = DefaultAppTokenDefinition,
  K extends keyof AppTokenPosition = keyof AppTokenPosition,
> = PositionBuilderContext<T, R> & {
  appToken: Omit<AppTokenPosition<V>, K>;
};

export type GetUnderlyingTokensParams<T, R = DefaultAppTokenDefinition> = PositionBuilderContext<T, R>;

export type GetTokenPropsParams<T, R = DefaultAppTokenDefinition> = PositionBuilderContext<T, R>;

export type GetPricePerShareParams<
  T,
  V = DefaultAppTokenDataProps,
  R = DefaultAppTokenDefinition,
> = PositionBuilderContextWithAppToken<T, V, R, 'pricePerShare' | 'price' | 'dataProps' | 'displayProps'>;

export type GetPriceParams<
  T,
  V = DefaultAppTokenDataProps,
  R = DefaultAppTokenDefinition,
> = PositionBuilderContextWithAppToken<T, V, R, 'price' | 'dataProps' | 'displayProps'>;

export type GetDataPropsParams<
  T,
  V = DefaultAppTokenDataProps,
  R = DefaultAppTokenDefinition,
> = PositionBuilderContextWithAppToken<T, V, R, 'dataProps' | 'displayProps'>;

export type GetDisplayPropsParams<
  T,
  V = DefaultAppTokenDataProps,
  R = DefaultAppTokenDefinition,
> = PositionBuilderContextWithAppToken<T, V, R, 'displayProps'>;
