import { IMulticallWrapper } from '~multicall/multicall.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenPosition } from '~position/position.interface';
import { TokenDependencySelector } from '~position/selectors/token-dependency-selector.interface';

export type DefaultAppTokenDefinition = {
  address: string;
};

// PHASE 1: List addresses and definitions
export type GetDefinitionStageParams = {
  multicall: IMulticallWrapper;
};

export type GetAddressesStageParams<R extends DefaultAppTokenDefinition = DefaultAppTokenDefinition> = {
  multicall: IMulticallWrapper;
  definitions: R[];
};

// PHASE 2: Build position objects
type PositionBuilderContext<T, R = DefaultAppTokenDefinition> = {
  multicall: IMulticallWrapper;
  tokenLoader: TokenDependencySelector;
  address: string;
  definition: R;
  contract: T;
};

type PartialAppToken<V, K extends keyof AppTokenPosition> = Omit<AppTokenPosition<V>, K>;

export type GetUnderlyingTokensStageParams<T, R = DefaultAppTokenDefinition> = PositionBuilderContext<T, R>;

export type GetTokenPropsStageParams<T, R = DefaultAppTokenDefinition> = PositionBuilderContext<T, R>;

export type GetPricePerShareStageParams<
  T,
  V = DefaultDataProps,
  R = DefaultAppTokenDefinition,
> = PositionBuilderContext<T, R> & {
  appToken: PartialAppToken<V, 'pricePerShare' | 'price' | 'dataProps' | 'displayProps'>;
};

export type GetPriceStageParams<T, V = DefaultDataProps, R = DefaultAppTokenDefinition> = PositionBuilderContext<
  T,
  R
> & {
  appToken: PartialAppToken<V, 'price' | 'dataProps' | 'displayProps'>;
};

export type GetDataPropsStageParams<T, V = DefaultDataProps, R = DefaultAppTokenDefinition> = PositionBuilderContext<
  T,
  R
> & {
  appToken: PartialAppToken<V, 'dataProps' | 'displayProps'>;
};

export type GetDisplayPropsStageParams<T, V = DefaultDataProps, R = DefaultAppTokenDefinition> = PositionBuilderContext<
  T,
  R
> & {
  appToken: PartialAppToken<V, 'displayProps'>;
};
