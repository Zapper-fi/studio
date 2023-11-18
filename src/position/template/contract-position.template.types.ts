import { Abi, GetContractReturnType, PublicClient } from 'viem';

import { ViemMulticallDataLoader } from '~multicall';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import { TokenDependencySelector } from '~position/selectors/token-dependency-selector.interface';
import { Network } from '~types';

export type DefaultContractPositionDefinition = {
  address: string;
};

export type UnderlyingTokenDefinition = {
  metaType: MetaType;
  address: string;
  network: Network;
  tokenId?: string;
};

// PHASE 1: List definitions
export type GetDefinitionsParams = {
  multicall: ViemMulticallDataLoader;
  tokenLoader: TokenDependencySelector;
};

// PHASE 2: Build position objects
export type ContractPositionBuilderContext<T extends Abi, R = DefaultContractPositionDefinition> = {
  multicall: ViemMulticallDataLoader;
  tokenLoader: TokenDependencySelector;
  address: string;
  definition: R;
  contract: GetContractReturnType<T, PublicClient>;
};

export type ContractPositionBuilderContextWithContractPosition<
  T extends Abi,
  V = DefaultDataProps,
  R = DefaultContractPositionDefinition,
  K extends keyof ContractPosition = keyof ContractPosition,
> = ContractPositionBuilderContext<T, R> & {
  contractPosition: Omit<ContractPosition<V>, K>;
};

export type GetTokenDefinitionsParams<
  T extends Abi,
  R = DefaultContractPositionDefinition,
> = ContractPositionBuilderContext<T, R>;

export type GetDataPropsParams<
  T extends Abi,
  V extends DefaultDataProps = DefaultDataProps,
  R extends DefaultContractPositionDefinition = DefaultContractPositionDefinition,
> = ContractPositionBuilderContextWithContractPosition<T, V, R, 'dataProps' | 'displayProps'>;

export type GetDisplayPropsParams<
  T extends Abi,
  V extends DefaultDataProps = DefaultDataProps,
  R extends DefaultContractPositionDefinition = DefaultContractPositionDefinition,
> = ContractPositionBuilderContextWithContractPosition<T, V, R, 'displayProps'>;

// PHASE 3: Get balances
export type GetTokenBalancesParams<T extends Abi, V extends DefaultDataProps = DefaultDataProps> = {
  address: string;
  contractPosition: ContractPosition<V>;
  contract: GetContractReturnType<T, PublicClient>;
  multicall: ViemMulticallDataLoader;
};
