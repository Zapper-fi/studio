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
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers';
import type { FunctionFragment, Result, EventFragment } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common';

export declare namespace MiniChefV2 {
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

export interface PickleMiniChefV2Interface extends utils.Interface {
  functions: {
    'PICKLE()': FunctionFragment;
    'add(uint256,address,address)': FunctionFragment;
    'batch(bytes[],bool)': FunctionFragment;
    'claimOwnership()': FunctionFragment;
    'deposit(uint256,uint256,address)': FunctionFragment;
    'emergencyWithdraw(uint256,address)': FunctionFragment;
    'harvest(uint256,address)': FunctionFragment;
    'lpToken(uint256)': FunctionFragment;
    'massUpdatePools(uint256[])': FunctionFragment;
    'migrate(uint256)': FunctionFragment;
    'migrator()': FunctionFragment;
    'owner()': FunctionFragment;
    'pendingOwner()': FunctionFragment;
    'pendingPickle(uint256,address)': FunctionFragment;
    'permitToken(address,address,address,uint256,uint256,uint8,bytes32,bytes32)': FunctionFragment;
    'picklePerSecond()': FunctionFragment;
    'poolInfo(uint256)': FunctionFragment;
    'poolLength()': FunctionFragment;
    'rewarder(uint256)': FunctionFragment;
    'set(uint256,uint256,address,bool)': FunctionFragment;
    'setMigrator(address)': FunctionFragment;
    'setPicklePerSecond(uint256)': FunctionFragment;
    'totalAllocPoint()': FunctionFragment;
    'transferOwnership(address,bool,bool)': FunctionFragment;
    'updatePool(uint256)': FunctionFragment;
    'userInfo(uint256,address)': FunctionFragment;
    'withdraw(uint256,uint256,address)': FunctionFragment;
    'withdrawAndHarvest(uint256,uint256,address)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'PICKLE'
      | 'add'
      | 'batch'
      | 'claimOwnership'
      | 'deposit'
      | 'emergencyWithdraw'
      | 'harvest'
      | 'lpToken'
      | 'massUpdatePools'
      | 'migrate'
      | 'migrator'
      | 'owner'
      | 'pendingOwner'
      | 'pendingPickle'
      | 'permitToken'
      | 'picklePerSecond'
      | 'poolInfo'
      | 'poolLength'
      | 'rewarder'
      | 'set'
      | 'setMigrator'
      | 'setPicklePerSecond'
      | 'totalAllocPoint'
      | 'transferOwnership'
      | 'updatePool'
      | 'userInfo'
      | 'withdraw'
      | 'withdrawAndHarvest',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'PICKLE', values?: undefined): string;
  encodeFunctionData(functionFragment: 'add', values: [BigNumberish, string, string]): string;
  encodeFunctionData(functionFragment: 'batch', values: [BytesLike[], boolean]): string;
  encodeFunctionData(functionFragment: 'claimOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'deposit', values: [BigNumberish, BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'emergencyWithdraw', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'harvest', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'lpToken', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'massUpdatePools', values: [BigNumberish[]]): string;
  encodeFunctionData(functionFragment: 'migrate', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'migrator', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pendingOwner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pendingPickle', values: [BigNumberish, string]): string;
  encodeFunctionData(
    functionFragment: 'permitToken',
    values: [string, string, string, BigNumberish, BigNumberish, BigNumberish, BytesLike, BytesLike],
  ): string;
  encodeFunctionData(functionFragment: 'picklePerSecond', values?: undefined): string;
  encodeFunctionData(functionFragment: 'poolInfo', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'poolLength', values?: undefined): string;
  encodeFunctionData(functionFragment: 'rewarder', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'set', values: [BigNumberish, BigNumberish, string, boolean]): string;
  encodeFunctionData(functionFragment: 'setMigrator', values: [string]): string;
  encodeFunctionData(functionFragment: 'setPicklePerSecond', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'totalAllocPoint', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [string, boolean, boolean]): string;
  encodeFunctionData(functionFragment: 'updatePool', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'userInfo', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'withdraw', values: [BigNumberish, BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'withdrawAndHarvest', values: [BigNumberish, BigNumberish, string]): string;

  decodeFunctionResult(functionFragment: 'PICKLE', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'add', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'batch', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'emergencyWithdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'harvest', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lpToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'massUpdatePools', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'migrate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'migrator', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingOwner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingPickle', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'permitToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'picklePerSecond', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewarder', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'set', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setMigrator', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setPicklePerSecond', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalAllocPoint', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updatePool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'userInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdrawAndHarvest', data: BytesLike): Result;

  events: {
    'Deposit(address,uint256,uint256,address)': EventFragment;
    'EmergencyWithdraw(address,uint256,uint256,address)': EventFragment;
    'Harvest(address,uint256,uint256)': EventFragment;
    'LogPicklePerSecond(uint256)': EventFragment;
    'LogPoolAddition(uint256,uint256,address,address)': EventFragment;
    'LogSetPool(uint256,uint256,address,bool)': EventFragment;
    'LogUpdatePool(uint256,uint64,uint256,uint256)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'Withdraw(address,uint256,uint256,address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Deposit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'EmergencyWithdraw'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Harvest'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogPicklePerSecond'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogPoolAddition'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogSetPool'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogUpdatePool'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdraw'): EventFragment;
}

export interface DepositEventObject {
  user: string;
  pid: BigNumber;
  amount: BigNumber;
  to: string;
}
export type DepositEvent = TypedEvent<[string, BigNumber, BigNumber, string], DepositEventObject>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface EmergencyWithdrawEventObject {
  user: string;
  pid: BigNumber;
  amount: BigNumber;
  to: string;
}
export type EmergencyWithdrawEvent = TypedEvent<[string, BigNumber, BigNumber, string], EmergencyWithdrawEventObject>;

export type EmergencyWithdrawEventFilter = TypedEventFilter<EmergencyWithdrawEvent>;

export interface HarvestEventObject {
  user: string;
  pid: BigNumber;
  amount: BigNumber;
}
export type HarvestEvent = TypedEvent<[string, BigNumber, BigNumber], HarvestEventObject>;

export type HarvestEventFilter = TypedEventFilter<HarvestEvent>;

export interface LogPicklePerSecondEventObject {
  picklePerSecond: BigNumber;
}
export type LogPicklePerSecondEvent = TypedEvent<[BigNumber], LogPicklePerSecondEventObject>;

export type LogPicklePerSecondEventFilter = TypedEventFilter<LogPicklePerSecondEvent>;

export interface LogPoolAdditionEventObject {
  pid: BigNumber;
  allocPoint: BigNumber;
  lpToken: string;
  rewarder: string;
}
export type LogPoolAdditionEvent = TypedEvent<[BigNumber, BigNumber, string, string], LogPoolAdditionEventObject>;

export type LogPoolAdditionEventFilter = TypedEventFilter<LogPoolAdditionEvent>;

export interface LogSetPoolEventObject {
  pid: BigNumber;
  allocPoint: BigNumber;
  rewarder: string;
  overwrite: boolean;
}
export type LogSetPoolEvent = TypedEvent<[BigNumber, BigNumber, string, boolean], LogSetPoolEventObject>;

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

export interface WithdrawEventObject {
  user: string;
  pid: BigNumber;
  amount: BigNumber;
  to: string;
}
export type WithdrawEvent = TypedEvent<[string, BigNumber, BigNumber, string], WithdrawEventObject>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface PickleMiniChefV2 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PickleMiniChefV2Interface;

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
    PICKLE(overrides?: CallOverrides): Promise<[string]>;

    add(
      allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    batch(
      calls: BytesLike[],
      revertOnFail: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    claimOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    deposit(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    emergencyWithdraw(
      pid: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    harvest(
      pid: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    migrate(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    migrator(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pendingOwner(overrides?: CallOverrides): Promise<[string]>;

    pendingPickle(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { pending: BigNumber }>;

    permitToken(
      token: string,
      from: string,
      to: string,
      amount: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    picklePerSecond(overrides?: CallOverrides): Promise<[BigNumber]>;

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

    rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      overwrite: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setMigrator(
      _migrator: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setPicklePerSecond(
      _picklePerSecond: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    totalAllocPoint(overrides?: CallOverrides): Promise<[BigNumber]>;

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

    withdraw(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    withdrawAndHarvest(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;
  };

  PICKLE(overrides?: CallOverrides): Promise<string>;

  add(
    allocPoint: BigNumberish,
    _lpToken: string,
    _rewarder: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  batch(
    calls: BytesLike[],
    revertOnFail: boolean,
    overrides?: PayableOverrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  claimOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  deposit(
    pid: BigNumberish,
    amount: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  emergencyWithdraw(
    pid: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  harvest(
    pid: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  massUpdatePools(
    pids: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  migrate(
    _pid: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  migrator(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  pendingOwner(overrides?: CallOverrides): Promise<string>;

  pendingPickle(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

  permitToken(
    token: string,
    from: string,
    to: string,
    amount: BigNumberish,
    deadline: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  picklePerSecond(overrides?: CallOverrides): Promise<BigNumber>;

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

  rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  set(
    _pid: BigNumberish,
    _allocPoint: BigNumberish,
    _rewarder: string,
    overwrite: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setMigrator(
    _migrator: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setPicklePerSecond(
    _picklePerSecond: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

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

  withdraw(
    pid: BigNumberish,
    amount: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  withdrawAndHarvest(
    pid: BigNumberish,
    amount: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    PICKLE(overrides?: CallOverrides): Promise<string>;

    add(allocPoint: BigNumberish, _lpToken: string, _rewarder: string, overrides?: CallOverrides): Promise<void>;

    batch(
      calls: BytesLike[],
      revertOnFail: boolean,
      overrides?: CallOverrides,
    ): Promise<[boolean[], string[]] & { successes: boolean[]; results: string[] }>;

    claimOwnership(overrides?: CallOverrides): Promise<void>;

    deposit(pid: BigNumberish, amount: BigNumberish, to: string, overrides?: CallOverrides): Promise<void>;

    emergencyWithdraw(pid: BigNumberish, to: string, overrides?: CallOverrides): Promise<void>;

    harvest(pid: BigNumberish, to: string, overrides?: CallOverrides): Promise<void>;

    lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    massUpdatePools(pids: BigNumberish[], overrides?: CallOverrides): Promise<void>;

    migrate(_pid: BigNumberish, overrides?: CallOverrides): Promise<void>;

    migrator(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    pendingOwner(overrides?: CallOverrides): Promise<string>;

    pendingPickle(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

    permitToken(
      token: string,
      from: string,
      to: string,
      amount: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides,
    ): Promise<void>;

    picklePerSecond(overrides?: CallOverrides): Promise<BigNumber>;

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

    rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      overwrite: boolean,
      overrides?: CallOverrides,
    ): Promise<void>;

    setMigrator(_migrator: string, overrides?: CallOverrides): Promise<void>;

    setPicklePerSecond(_picklePerSecond: BigNumberish, overrides?: CallOverrides): Promise<void>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(newOwner: string, direct: boolean, renounce: boolean, overrides?: CallOverrides): Promise<void>;

    updatePool(pid: BigNumberish, overrides?: CallOverrides): Promise<MiniChefV2.PoolInfoStructOutput>;

    userInfo(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;

    withdraw(pid: BigNumberish, amount: BigNumberish, to: string, overrides?: CallOverrides): Promise<void>;

    withdrawAndHarvest(pid: BigNumberish, amount: BigNumberish, to: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    'Deposit(address,uint256,uint256,address)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
      to?: string | null,
    ): DepositEventFilter;
    Deposit(user?: string | null, pid?: BigNumberish | null, amount?: null, to?: string | null): DepositEventFilter;

    'EmergencyWithdraw(address,uint256,uint256,address)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
      to?: string | null,
    ): EmergencyWithdrawEventFilter;
    EmergencyWithdraw(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
      to?: string | null,
    ): EmergencyWithdrawEventFilter;

    'Harvest(address,uint256,uint256)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
    ): HarvestEventFilter;
    Harvest(user?: string | null, pid?: BigNumberish | null, amount?: null): HarvestEventFilter;

    'LogPicklePerSecond(uint256)'(picklePerSecond?: null): LogPicklePerSecondEventFilter;
    LogPicklePerSecond(picklePerSecond?: null): LogPicklePerSecondEventFilter;

    'LogPoolAddition(uint256,uint256,address,address)'(
      pid?: BigNumberish | null,
      allocPoint?: null,
      lpToken?: string | null,
      rewarder?: string | null,
    ): LogPoolAdditionEventFilter;
    LogPoolAddition(
      pid?: BigNumberish | null,
      allocPoint?: null,
      lpToken?: string | null,
      rewarder?: string | null,
    ): LogPoolAdditionEventFilter;

    'LogSetPool(uint256,uint256,address,bool)'(
      pid?: BigNumberish | null,
      allocPoint?: null,
      rewarder?: string | null,
      overwrite?: null,
    ): LogSetPoolEventFilter;
    LogSetPool(
      pid?: BigNumberish | null,
      allocPoint?: null,
      rewarder?: string | null,
      overwrite?: null,
    ): LogSetPoolEventFilter;

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

    'Withdraw(address,uint256,uint256,address)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
      to?: string | null,
    ): WithdrawEventFilter;
    Withdraw(user?: string | null, pid?: BigNumberish | null, amount?: null, to?: string | null): WithdrawEventFilter;
  };

  estimateGas: {
    PICKLE(overrides?: CallOverrides): Promise<BigNumber>;

    add(
      allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    batch(
      calls: BytesLike[],
      revertOnFail: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    claimOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    deposit(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    emergencyWithdraw(
      pid: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    harvest(
      pid: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    migrate(_pid: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    migrator(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pendingOwner(overrides?: CallOverrides): Promise<BigNumber>;

    pendingPickle(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

    permitToken(
      token: string,
      from: string,
      to: string,
      amount: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    picklePerSecond(overrides?: CallOverrides): Promise<BigNumber>;

    poolInfo(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      overwrite: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    setMigrator(_migrator: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    setPicklePerSecond(
      _picklePerSecond: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      direct: boolean,
      renounce: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    updatePool(pid: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    userInfo(arg0: BigNumberish, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    withdrawAndHarvest(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    PICKLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    add(
      allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    batch(
      calls: BytesLike[],
      revertOnFail: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    claimOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    deposit(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    emergencyWithdraw(
      pid: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    harvest(
      pid: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    migrate(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    migrator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingPickle(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    permitToken(
      token: string,
      from: string,
      to: string,
      amount: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    picklePerSecond(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolInfo(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      overwrite: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setMigrator(
      _migrator: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setPicklePerSecond(
      _picklePerSecond: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    totalAllocPoint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

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

    withdraw(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    withdrawAndHarvest(
      pid: BigNumberish,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;
  };
}
