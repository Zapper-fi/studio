/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers';
import type { FunctionFragment, Result, EventFragment } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common';

export interface TarotFactoryInterface extends utils.Interface {
  functions: {
    '_acceptAdmin()': FunctionFragment;
    '_acceptReservesAdmin()': FunctionFragment;
    '_setPendingAdmin(address)': FunctionFragment;
    '_setReservesManager(address)': FunctionFragment;
    '_setReservesPendingAdmin(address)': FunctionFragment;
    'admin()': FunctionFragment;
    'allLendingPools(uint256)': FunctionFragment;
    'allLendingPoolsLength()': FunctionFragment;
    'bDeployer()': FunctionFragment;
    'cDeployer()': FunctionFragment;
    'createBorrowable0(address)': FunctionFragment;
    'createBorrowable1(address)': FunctionFragment;
    'createCollateral(address)': FunctionFragment;
    'getLendingPool(address)': FunctionFragment;
    'initializeLendingPool(address)': FunctionFragment;
    'pendingAdmin()': FunctionFragment;
    'reservesAdmin()': FunctionFragment;
    'reservesManager()': FunctionFragment;
    'reservesPendingAdmin()': FunctionFragment;
    'tarotPriceOracle()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | '_acceptAdmin'
      | '_acceptReservesAdmin'
      | '_setPendingAdmin'
      | '_setReservesManager'
      | '_setReservesPendingAdmin'
      | 'admin'
      | 'allLendingPools'
      | 'allLendingPoolsLength'
      | 'bDeployer'
      | 'cDeployer'
      | 'createBorrowable0'
      | 'createBorrowable1'
      | 'createCollateral'
      | 'getLendingPool'
      | 'initializeLendingPool'
      | 'pendingAdmin'
      | 'reservesAdmin'
      | 'reservesManager'
      | 'reservesPendingAdmin'
      | 'tarotPriceOracle',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: '_acceptAdmin', values?: undefined): string;
  encodeFunctionData(functionFragment: '_acceptReservesAdmin', values?: undefined): string;
  encodeFunctionData(functionFragment: '_setPendingAdmin', values: [string]): string;
  encodeFunctionData(functionFragment: '_setReservesManager', values: [string]): string;
  encodeFunctionData(functionFragment: '_setReservesPendingAdmin', values: [string]): string;
  encodeFunctionData(functionFragment: 'admin', values?: undefined): string;
  encodeFunctionData(functionFragment: 'allLendingPools', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'allLendingPoolsLength', values?: undefined): string;
  encodeFunctionData(functionFragment: 'bDeployer', values?: undefined): string;
  encodeFunctionData(functionFragment: 'cDeployer', values?: undefined): string;
  encodeFunctionData(functionFragment: 'createBorrowable0', values: [string]): string;
  encodeFunctionData(functionFragment: 'createBorrowable1', values: [string]): string;
  encodeFunctionData(functionFragment: 'createCollateral', values: [string]): string;
  encodeFunctionData(functionFragment: 'getLendingPool', values: [string]): string;
  encodeFunctionData(functionFragment: 'initializeLendingPool', values: [string]): string;
  encodeFunctionData(functionFragment: 'pendingAdmin', values?: undefined): string;
  encodeFunctionData(functionFragment: 'reservesAdmin', values?: undefined): string;
  encodeFunctionData(functionFragment: 'reservesManager', values?: undefined): string;
  encodeFunctionData(functionFragment: 'reservesPendingAdmin', values?: undefined): string;
  encodeFunctionData(functionFragment: 'tarotPriceOracle', values?: undefined): string;

  decodeFunctionResult(functionFragment: '_acceptAdmin', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: '_acceptReservesAdmin', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: '_setPendingAdmin', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: '_setReservesManager', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: '_setReservesPendingAdmin', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'admin', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'allLendingPools', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'allLendingPoolsLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'bDeployer', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'cDeployer', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'createBorrowable0', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'createBorrowable1', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'createCollateral', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getLendingPool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'initializeLendingPool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingAdmin', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'reservesAdmin', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'reservesManager', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'reservesPendingAdmin', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'tarotPriceOracle', data: BytesLike): Result;

  events: {
    'LendingPoolInitialized(address,address,address,address,address,address,uint256)': EventFragment;
    'NewAdmin(address,address)': EventFragment;
    'NewPendingAdmin(address,address)': EventFragment;
    'NewReservesAdmin(address,address)': EventFragment;
    'NewReservesManager(address,address)': EventFragment;
    'NewReservesPendingAdmin(address,address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'LendingPoolInitialized'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'NewAdmin'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'NewPendingAdmin'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'NewReservesAdmin'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'NewReservesManager'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'NewReservesPendingAdmin'): EventFragment;
}

export interface LendingPoolInitializedEventObject {
  uniswapV2Pair: string;
  token0: string;
  token1: string;
  collateral: string;
  borrowable0: string;
  borrowable1: string;
  lendingPoolId: BigNumber;
}
export type LendingPoolInitializedEvent = TypedEvent<
  [string, string, string, string, string, string, BigNumber],
  LendingPoolInitializedEventObject
>;

export type LendingPoolInitializedEventFilter = TypedEventFilter<LendingPoolInitializedEvent>;

export interface NewAdminEventObject {
  oldAdmin: string;
  newAdmin: string;
}
export type NewAdminEvent = TypedEvent<[string, string], NewAdminEventObject>;

export type NewAdminEventFilter = TypedEventFilter<NewAdminEvent>;

export interface NewPendingAdminEventObject {
  oldPendingAdmin: string;
  newPendingAdmin: string;
}
export type NewPendingAdminEvent = TypedEvent<[string, string], NewPendingAdminEventObject>;

export type NewPendingAdminEventFilter = TypedEventFilter<NewPendingAdminEvent>;

export interface NewReservesAdminEventObject {
  oldReservesAdmin: string;
  newReservesAdmin: string;
}
export type NewReservesAdminEvent = TypedEvent<[string, string], NewReservesAdminEventObject>;

export type NewReservesAdminEventFilter = TypedEventFilter<NewReservesAdminEvent>;

export interface NewReservesManagerEventObject {
  oldReservesManager: string;
  newReservesManager: string;
}
export type NewReservesManagerEvent = TypedEvent<[string, string], NewReservesManagerEventObject>;

export type NewReservesManagerEventFilter = TypedEventFilter<NewReservesManagerEvent>;

export interface NewReservesPendingAdminEventObject {
  oldReservesPendingAdmin: string;
  newReservesPendingAdmin: string;
}
export type NewReservesPendingAdminEvent = TypedEvent<[string, string], NewReservesPendingAdminEventObject>;

export type NewReservesPendingAdminEventFilter = TypedEventFilter<NewReservesPendingAdminEvent>;

export interface TarotFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TarotFactoryInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    _acceptAdmin(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    _acceptReservesAdmin(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    _setPendingAdmin(
      newPendingAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    _setReservesManager(
      newReservesManager: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    _setReservesPendingAdmin(
      newReservesPendingAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    admin(overrides?: CallOverrides): Promise<[string]>;

    allLendingPools(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    allLendingPoolsLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    bDeployer(overrides?: CallOverrides): Promise<[string]>;

    cDeployer(overrides?: CallOverrides): Promise<[string]>;

    createBorrowable0(
      uniswapV2Pair: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    createBorrowable1(
      uniswapV2Pair: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    createCollateral(
      uniswapV2Pair: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    getLendingPool(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<
      [boolean, number, string, string, string] & {
        initialized: boolean;
        lendingPoolId: number;
        collateral: string;
        borrowable0: string;
        borrowable1: string;
      }
    >;

    initializeLendingPool(
      uniswapV2Pair: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    pendingAdmin(overrides?: CallOverrides): Promise<[string]>;

    reservesAdmin(overrides?: CallOverrides): Promise<[string]>;

    reservesManager(overrides?: CallOverrides): Promise<[string]>;

    reservesPendingAdmin(overrides?: CallOverrides): Promise<[string]>;

    tarotPriceOracle(overrides?: CallOverrides): Promise<[string]>;
  };

  _acceptAdmin(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  _acceptReservesAdmin(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  _setPendingAdmin(
    newPendingAdmin: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  _setReservesManager(
    newReservesManager: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  _setReservesPendingAdmin(
    newReservesPendingAdmin: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  admin(overrides?: CallOverrides): Promise<string>;

  allLendingPools(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  allLendingPoolsLength(overrides?: CallOverrides): Promise<BigNumber>;

  bDeployer(overrides?: CallOverrides): Promise<string>;

  cDeployer(overrides?: CallOverrides): Promise<string>;

  createBorrowable0(
    uniswapV2Pair: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  createBorrowable1(
    uniswapV2Pair: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  createCollateral(
    uniswapV2Pair: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  getLendingPool(
    arg0: string,
    overrides?: CallOverrides,
  ): Promise<
    [boolean, number, string, string, string] & {
      initialized: boolean;
      lendingPoolId: number;
      collateral: string;
      borrowable0: string;
      borrowable1: string;
    }
  >;

  initializeLendingPool(
    uniswapV2Pair: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  pendingAdmin(overrides?: CallOverrides): Promise<string>;

  reservesAdmin(overrides?: CallOverrides): Promise<string>;

  reservesManager(overrides?: CallOverrides): Promise<string>;

  reservesPendingAdmin(overrides?: CallOverrides): Promise<string>;

  tarotPriceOracle(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    _acceptAdmin(overrides?: CallOverrides): Promise<void>;

    _acceptReservesAdmin(overrides?: CallOverrides): Promise<void>;

    _setPendingAdmin(newPendingAdmin: string, overrides?: CallOverrides): Promise<void>;

    _setReservesManager(newReservesManager: string, overrides?: CallOverrides): Promise<void>;

    _setReservesPendingAdmin(newReservesPendingAdmin: string, overrides?: CallOverrides): Promise<void>;

    admin(overrides?: CallOverrides): Promise<string>;

    allLendingPools(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    allLendingPoolsLength(overrides?: CallOverrides): Promise<BigNumber>;

    bDeployer(overrides?: CallOverrides): Promise<string>;

    cDeployer(overrides?: CallOverrides): Promise<string>;

    createBorrowable0(uniswapV2Pair: string, overrides?: CallOverrides): Promise<string>;

    createBorrowable1(uniswapV2Pair: string, overrides?: CallOverrides): Promise<string>;

    createCollateral(uniswapV2Pair: string, overrides?: CallOverrides): Promise<string>;

    getLendingPool(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<
      [boolean, number, string, string, string] & {
        initialized: boolean;
        lendingPoolId: number;
        collateral: string;
        borrowable0: string;
        borrowable1: string;
      }
    >;

    initializeLendingPool(uniswapV2Pair: string, overrides?: CallOverrides): Promise<void>;

    pendingAdmin(overrides?: CallOverrides): Promise<string>;

    reservesAdmin(overrides?: CallOverrides): Promise<string>;

    reservesManager(overrides?: CallOverrides): Promise<string>;

    reservesPendingAdmin(overrides?: CallOverrides): Promise<string>;

    tarotPriceOracle(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    'LendingPoolInitialized(address,address,address,address,address,address,uint256)'(
      uniswapV2Pair?: string | null,
      token0?: string | null,
      token1?: string | null,
      collateral?: null,
      borrowable0?: null,
      borrowable1?: null,
      lendingPoolId?: null,
    ): LendingPoolInitializedEventFilter;
    LendingPoolInitialized(
      uniswapV2Pair?: string | null,
      token0?: string | null,
      token1?: string | null,
      collateral?: null,
      borrowable0?: null,
      borrowable1?: null,
      lendingPoolId?: null,
    ): LendingPoolInitializedEventFilter;

    'NewAdmin(address,address)'(oldAdmin?: null, newAdmin?: null): NewAdminEventFilter;
    NewAdmin(oldAdmin?: null, newAdmin?: null): NewAdminEventFilter;

    'NewPendingAdmin(address,address)'(oldPendingAdmin?: null, newPendingAdmin?: null): NewPendingAdminEventFilter;
    NewPendingAdmin(oldPendingAdmin?: null, newPendingAdmin?: null): NewPendingAdminEventFilter;

    'NewReservesAdmin(address,address)'(oldReservesAdmin?: null, newReservesAdmin?: null): NewReservesAdminEventFilter;
    NewReservesAdmin(oldReservesAdmin?: null, newReservesAdmin?: null): NewReservesAdminEventFilter;

    'NewReservesManager(address,address)'(
      oldReservesManager?: null,
      newReservesManager?: null,
    ): NewReservesManagerEventFilter;
    NewReservesManager(oldReservesManager?: null, newReservesManager?: null): NewReservesManagerEventFilter;

    'NewReservesPendingAdmin(address,address)'(
      oldReservesPendingAdmin?: null,
      newReservesPendingAdmin?: null,
    ): NewReservesPendingAdminEventFilter;
    NewReservesPendingAdmin(
      oldReservesPendingAdmin?: null,
      newReservesPendingAdmin?: null,
    ): NewReservesPendingAdminEventFilter;
  };

  estimateGas: {
    _acceptAdmin(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    _acceptReservesAdmin(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    _setPendingAdmin(
      newPendingAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    _setReservesManager(
      newReservesManager: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    _setReservesPendingAdmin(
      newReservesPendingAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<BigNumber>;

    allLendingPools(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    allLendingPoolsLength(overrides?: CallOverrides): Promise<BigNumber>;

    bDeployer(overrides?: CallOverrides): Promise<BigNumber>;

    cDeployer(overrides?: CallOverrides): Promise<BigNumber>;

    createBorrowable0(
      uniswapV2Pair: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    createBorrowable1(
      uniswapV2Pair: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    createCollateral(
      uniswapV2Pair: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    getLendingPool(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    initializeLendingPool(
      uniswapV2Pair: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    pendingAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    reservesAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    reservesManager(overrides?: CallOverrides): Promise<BigNumber>;

    reservesPendingAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    tarotPriceOracle(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    _acceptAdmin(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    _acceptReservesAdmin(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    _setPendingAdmin(
      newPendingAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    _setReservesManager(
      newReservesManager: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    _setReservesPendingAdmin(
      newReservesPendingAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    allLendingPools(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    allLendingPoolsLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bDeployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    cDeployer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    createBorrowable0(
      uniswapV2Pair: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    createBorrowable1(
      uniswapV2Pair: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    createCollateral(
      uniswapV2Pair: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    getLendingPool(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initializeLendingPool(
      uniswapV2Pair: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    pendingAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    reservesAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    reservesManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    reservesPendingAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tarotPriceOracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
