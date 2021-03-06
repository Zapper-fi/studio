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

export declare namespace PickleRewarder {
  export type PoolInfoStruct = {
    accPicklePerShare: BigNumberish;
    lastRewardTime: BigNumberish;
    allocPoint: BigNumberish;
  };

  export type PoolInfoStructOutput = [BigNumber, BigNumber, BigNumber] & {
    accPicklePerShare: BigNumber;
    lastRewardTime: BigNumber;
    allocPoint: BigNumber;
  };
}

export interface PickleRewarderInterface extends utils.Interface {
  functions: {
    'add(uint256,uint256)': FunctionFragment;
    'claimOwnership()': FunctionFragment;
    'massUpdatePools(uint256[])': FunctionFragment;
    'onPickleReward(uint256,address,address,uint256,uint256)': FunctionFragment;
    'owner()': FunctionFragment;
    'pendingOwner()': FunctionFragment;
    'pendingToken(uint256,address)': FunctionFragment;
    'pendingTokens(uint256,address,uint256)': FunctionFragment;
    'poolIds(uint256)': FunctionFragment;
    'poolInfo(uint256)': FunctionFragment;
    'poolLength()': FunctionFragment;
    'rewardPerSecond()': FunctionFragment;
    'set(uint256,uint256)': FunctionFragment;
    'setRewardPerSecond(uint256)': FunctionFragment;
    'transferOwnership(address,bool,bool)': FunctionFragment;
    'updatePool(uint256)': FunctionFragment;
    'userInfo(uint256,address)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'add'
      | 'claimOwnership'
      | 'massUpdatePools'
      | 'onPickleReward'
      | 'owner'
      | 'pendingOwner'
      | 'pendingToken'
      | 'pendingTokens'
      | 'poolIds'
      | 'poolInfo'
      | 'poolLength'
      | 'rewardPerSecond'
      | 'set'
      | 'setRewardPerSecond'
      | 'transferOwnership'
      | 'updatePool'
      | 'userInfo',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'add', values: [BigNumberish, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'claimOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'massUpdatePools', values: [BigNumberish[]]): string;
  encodeFunctionData(
    functionFragment: 'onPickleReward',
    values: [BigNumberish, string, string, BigNumberish, BigNumberish],
  ): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pendingOwner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pendingToken', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'pendingTokens', values: [BigNumberish, string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'poolIds', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'poolInfo', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'poolLength', values?: undefined): string;
  encodeFunctionData(functionFragment: 'rewardPerSecond', values?: undefined): string;
  encodeFunctionData(functionFragment: 'set', values: [BigNumberish, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'setRewardPerSecond', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [string, boolean, boolean]): string;
  encodeFunctionData(functionFragment: 'updatePool', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'userInfo', values: [BigNumberish, string]): string;

  decodeFunctionResult(functionFragment: 'add', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'massUpdatePools', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'onPickleReward', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingOwner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingTokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolIds', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardPerSecond', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'set', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setRewardPerSecond', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updatePool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'userInfo', data: BytesLike): Result;

  events: {
    'LogInit()': EventFragment;
    'LogOnReward(address,uint256,uint256,address)': EventFragment;
    'LogPoolAddition(uint256,uint256)': EventFragment;
    'LogRewardPerSecond(uint256)': EventFragment;
    'LogSetPool(uint256,uint256)': EventFragment;
    'LogUpdatePool(uint256,uint64,uint256,uint256)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'LogInit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogOnReward'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogPoolAddition'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogRewardPerSecond'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogSetPool'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogUpdatePool'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
}

export interface LogInitEventObject {}
export type LogInitEvent = TypedEvent<[], LogInitEventObject>;

export type LogInitEventFilter = TypedEventFilter<LogInitEvent>;

export interface LogOnRewardEventObject {
  user: string;
  pid: BigNumber;
  amount: BigNumber;
  to: string;
}
export type LogOnRewardEvent = TypedEvent<[string, BigNumber, BigNumber, string], LogOnRewardEventObject>;

export type LogOnRewardEventFilter = TypedEventFilter<LogOnRewardEvent>;

export interface LogPoolAdditionEventObject {
  pid: BigNumber;
  allocPoint: BigNumber;
}
export type LogPoolAdditionEvent = TypedEvent<[BigNumber, BigNumber], LogPoolAdditionEventObject>;

export type LogPoolAdditionEventFilter = TypedEventFilter<LogPoolAdditionEvent>;

export interface LogRewardPerSecondEventObject {
  rewardPerSecond: BigNumber;
}
export type LogRewardPerSecondEvent = TypedEvent<[BigNumber], LogRewardPerSecondEventObject>;

export type LogRewardPerSecondEventFilter = TypedEventFilter<LogRewardPerSecondEvent>;

export interface LogSetPoolEventObject {
  pid: BigNumber;
  allocPoint: BigNumber;
}
export type LogSetPoolEvent = TypedEvent<[BigNumber, BigNumber], LogSetPoolEventObject>;

export type LogSetPoolEventFilter = TypedEventFilter<LogSetPoolEvent>;

export interface LogUpdatePoolEventObject {
  pid: BigNumber;
  lastRewardTime: BigNumber;
  lpSupply: BigNumber;
  accPicklePerShare: BigNumber;
}
export type LogUpdatePoolEvent = TypedEvent<[BigNumber, BigNumber, BigNumber, BigNumber], LogUpdatePoolEventObject>;

export type LogUpdatePoolEventFilter = TypedEventFilter<LogUpdatePoolEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[string, string], OwnershipTransferredEventObject>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface PickleRewarder extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PickleRewarderInterface;

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
    add(
      allocPoint: BigNumberish,
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    claimOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    onPickleReward(
      pid: BigNumberish,
      _user: string,
      to: string,
      arg3: BigNumberish,
      lpToken: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pendingOwner(overrides?: CallOverrides): Promise<[string]>;

    pendingToken(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { pending: BigNumber }>;

    pendingTokens(
      pid: BigNumberish,
      user: string,
      arg2: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [string[], BigNumber[]] & {
        rewardTokens: string[];
        rewardAmounts: BigNumber[];
      }
    >;

    poolIds(arg0: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    poolInfo(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        accPicklePerShare: BigNumber;
        lastRewardTime: BigNumber;
        allocPoint: BigNumber;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<[BigNumber] & { pools: BigNumber }>;

    rewardPerSecond(overrides?: CallOverrides): Promise<[BigNumber]>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setRewardPerSecond(
      _rewardPerSecond: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      direct: boolean,
      renounce: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    updatePool(
      pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    userInfo(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;
  };

  add(
    allocPoint: BigNumberish,
    _pid: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  claimOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  massUpdatePools(
    pids: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  onPickleReward(
    pid: BigNumberish,
    _user: string,
    to: string,
    arg3: BigNumberish,
    lpToken: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  pendingOwner(overrides?: CallOverrides): Promise<string>;

  pendingToken(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

  pendingTokens(
    pid: BigNumberish,
    user: string,
    arg2: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<
    [string[], BigNumber[]] & {
      rewardTokens: string[];
      rewardAmounts: BigNumber[];
    }
  >;

  poolIds(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  poolInfo(
    arg0: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      accPicklePerShare: BigNumber;
      lastRewardTime: BigNumber;
      allocPoint: BigNumber;
    }
  >;

  poolLength(overrides?: CallOverrides): Promise<BigNumber>;

  rewardPerSecond(overrides?: CallOverrides): Promise<BigNumber>;

  set(
    _pid: BigNumberish,
    _allocPoint: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setRewardPerSecond(
    _rewardPerSecond: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    direct: boolean,
    renounce: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  updatePool(
    pid: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  userInfo(
    arg0: BigNumberish,
    arg1: string,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;

  callStatic: {
    add(allocPoint: BigNumberish, _pid: BigNumberish, overrides?: CallOverrides): Promise<void>;

    claimOwnership(overrides?: CallOverrides): Promise<void>;

    massUpdatePools(pids: BigNumberish[], overrides?: CallOverrides): Promise<void>;

    onPickleReward(
      pid: BigNumberish,
      _user: string,
      to: string,
      arg3: BigNumberish,
      lpToken: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    pendingOwner(overrides?: CallOverrides): Promise<string>;

    pendingToken(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

    pendingTokens(
      pid: BigNumberish,
      user: string,
      arg2: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [string[], BigNumber[]] & {
        rewardTokens: string[];
        rewardAmounts: BigNumber[];
      }
    >;

    poolIds(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    poolInfo(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        accPicklePerShare: BigNumber;
        lastRewardTime: BigNumber;
        allocPoint: BigNumber;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerSecond(overrides?: CallOverrides): Promise<BigNumber>;

    set(_pid: BigNumberish, _allocPoint: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setRewardPerSecond(_rewardPerSecond: BigNumberish, overrides?: CallOverrides): Promise<void>;

    transferOwnership(newOwner: string, direct: boolean, renounce: boolean, overrides?: CallOverrides): Promise<void>;

    updatePool(pid: BigNumberish, overrides?: CallOverrides): Promise<PickleRewarder.PoolInfoStructOutput>;

    userInfo(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;
  };

  filters: {
    'LogInit()'(): LogInitEventFilter;
    LogInit(): LogInitEventFilter;

    'LogOnReward(address,uint256,uint256,address)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
      to?: string | null,
    ): LogOnRewardEventFilter;
    LogOnReward(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
      to?: string | null,
    ): LogOnRewardEventFilter;

    'LogPoolAddition(uint256,uint256)'(pid?: BigNumberish | null, allocPoint?: null): LogPoolAdditionEventFilter;
    LogPoolAddition(pid?: BigNumberish | null, allocPoint?: null): LogPoolAdditionEventFilter;

    'LogRewardPerSecond(uint256)'(rewardPerSecond?: null): LogRewardPerSecondEventFilter;
    LogRewardPerSecond(rewardPerSecond?: null): LogRewardPerSecondEventFilter;

    'LogSetPool(uint256,uint256)'(pid?: BigNumberish | null, allocPoint?: null): LogSetPoolEventFilter;
    LogSetPool(pid?: BigNumberish | null, allocPoint?: null): LogSetPoolEventFilter;

    'LogUpdatePool(uint256,uint64,uint256,uint256)'(
      pid?: BigNumberish | null,
      lastRewardTime?: null,
      lpSupply?: null,
      accPicklePerShare?: null,
    ): LogUpdatePoolEventFilter;
    LogUpdatePool(
      pid?: BigNumberish | null,
      lastRewardTime?: null,
      lpSupply?: null,
      accPicklePerShare?: null,
    ): LogUpdatePoolEventFilter;

    'OwnershipTransferred(address,address)'(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    add(
      allocPoint: BigNumberish,
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    claimOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    onPickleReward(
      pid: BigNumberish,
      _user: string,
      to: string,
      arg3: BigNumberish,
      lpToken: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pendingOwner(overrides?: CallOverrides): Promise<BigNumber>;

    pendingToken(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

    pendingTokens(pid: BigNumberish, user: string, arg2: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    poolIds(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    poolInfo(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerSecond(overrides?: CallOverrides): Promise<BigNumber>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    setRewardPerSecond(
      _rewardPerSecond: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      direct: boolean,
      renounce: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    updatePool(pid: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    userInfo(arg0: BigNumberish, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    add(
      allocPoint: BigNumberish,
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    claimOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    onPickleReward(
      pid: BigNumberish,
      _user: string,
      to: string,
      arg3: BigNumberish,
      lpToken: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingToken(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingTokens(
      pid: BigNumberish,
      user: string,
      arg2: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    poolIds(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolInfo(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardPerSecond(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setRewardPerSecond(
      _rewardPerSecond: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      direct: boolean,
      renounce: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    updatePool(
      pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    userInfo(arg0: BigNumberish, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
