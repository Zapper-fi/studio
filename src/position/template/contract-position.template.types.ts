import { Contract } from '@ethersproject/contracts';

import { IMulticallWrapper } from '~multicall/multicall.interface';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import { TokenDependencySelector } from '~position/selectors/token-dependency-selector.interface';

export type DefaultContractPositionDefinition = {
  address: string;
};

export type UnderlyingTokenDefinition = {
  address: string;
  metaType: MetaType;
};

// PHASE 1: List definitions
export type GetDefinitionsParams = {
  multicall: IMulticallWrapper;
  tokenLoader: TokenDependencySelector;
};

// PHASE 2: Build position objects
export type ContractPositionBuilderContext<T, R = DefaultContractPositionDefinition> = {
  multicall: IMulticallWrapper;
  tokenLoader: TokenDependencySelector;
  address: string;
  definition: R;
  contract: T;
};

export type ContractPositionBuilderContextWithContractPosition<
  T,
  V = DefaultDataProps,
  R = DefaultContractPositionDefinition,
  K extends keyof ContractPosition = keyof ContractPosition,
> = ContractPositionBuilderContext<T, R> & {
  contractPosition: Omit<ContractPosition<V>, K>;
};

export type GetTokenDefinitionsParams<T, R = DefaultContractPositionDefinition> = ContractPositionBuilderContext<T, R>;

export type GetDataPropsParams<
  T,
  V extends DefaultDataProps = DefaultDataProps,
  R extends DefaultContractPositionDefinition = DefaultContractPositionDefinition,
> = ContractPositionBuilderContextWithContractPosition<T, V, R, 'dataProps' | 'displayProps'>;

export type GetDisplayPropsParams<
  T,
  V extends DefaultDataProps = DefaultDataProps,
  R extends DefaultContractPositionDefinition = DefaultContractPositionDefinition,
> = ContractPositionBuilderContextWithContractPosition<T, V, R, 'displayProps'>;

// PHASE 3: Get balances
export type GetTokenBalancesParams<T extends Contract, V extends DefaultDataProps = DefaultDataProps> = {
  address: string;
  contractPosition: ContractPosition<V>;
  contract: T;
  multicall: IMulticallWrapper;
};
