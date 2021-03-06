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

export declare namespace MasterChefV2 {
  export type PoolInfoStruct = {
    accTriPerShare: BigNumberish;
    lastRewardBlock: BigNumberish;
    allocPoint: BigNumberish;
  };

  export type PoolInfoStructOutput = [BigNumber, BigNumber, BigNumber] & {
    accTriPerShare: BigNumber;
    lastRewardBlock: BigNumber;
    allocPoint: BigNumber;
  };
}

export interface TrisolarisMasterChefInterface extends utils.Interface {
  functions: {
    'MASTER_CHEF()': FunctionFragment;
    'MASTER_PID()': FunctionFragment;
    'TRI()': FunctionFragment;
    'add(uint256,address,address)': FunctionFragment;
    'deposit(uint256,uint256,address)': FunctionFragment;
    'emergencyWithdraw(uint256,address)': FunctionFragment;
    'harvest(uint256,address)': FunctionFragment;
    'harvestFromMasterChef()': FunctionFragment;
    'init(address)': FunctionFragment;
    'lpToken(uint256)': FunctionFragment;
    'massUpdatePools(uint256[])': FunctionFragment;
    'owner()': FunctionFragment;
    'pendingTri(uint256,address)': FunctionFragment;
    'poolInfo(uint256)': FunctionFragment;
    'poolLength()': FunctionFragment;
    'renounceOwnership()': FunctionFragment;
    'rewarder(uint256)': FunctionFragment;
    'set(uint256,uint256,address,bool)': FunctionFragment;
    'totalAllocPoint()': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
    'triPerBlock()': FunctionFragment;
    'updatePool(uint256)': FunctionFragment;
    'userInfo(uint256,address)': FunctionFragment;
    'withdraw(uint256,uint256,address)': FunctionFragment;
    'withdrawAndHarvest(uint256,uint256,address)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'MASTER_CHEF'
      | 'MASTER_PID'
      | 'TRI'
      | 'add'
      | 'deposit'
      | 'emergencyWithdraw'
      | 'harvest'
      | 'harvestFromMasterChef'
      | 'init'
      | 'lpToken'
      | 'massUpdatePools'
      | 'owner'
      | 'pendingTri'
      | 'poolInfo'
      | 'poolLength'
      | 'renounceOwnership'
      | 'rewarder'
      | 'set'
      | 'totalAllocPoint'
      | 'transferOwnership'
      | 'triPerBlock'
      | 'updatePool'
      | 'userInfo'
      | 'withdraw'
      | 'withdrawAndHarvest',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'MASTER_CHEF', values?: undefined): string;
  encodeFunctionData(functionFragment: 'MASTER_PID', values?: undefined): string;
  encodeFunctionData(functionFragment: 'TRI', values?: undefined): string;
  encodeFunctionData(functionFragment: 'add', values: [BigNumberish, string, string]): string;
  encodeFunctionData(functionFragment: 'deposit', values: [BigNumberish, BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'emergencyWithdraw', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'harvest', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'harvestFromMasterChef', values?: undefined): string;
  encodeFunctionData(functionFragment: 'init', values: [string]): string;
  encodeFunctionData(functionFragment: 'lpToken', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'massUpdatePools', values: [BigNumberish[]]): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pendingTri', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'poolInfo', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'poolLength', values?: undefined): string;
  encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'rewarder', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'set', values: [BigNumberish, BigNumberish, string, boolean]): string;
  encodeFunctionData(functionFragment: 'totalAllocPoint', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [string]): string;
  encodeFunctionData(functionFragment: 'triPerBlock', values?: undefined): string;
  encodeFunctionData(functionFragment: 'updatePool', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'userInfo', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'withdraw', values: [BigNumberish, BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'withdrawAndHarvest', values: [BigNumberish, BigNumberish, string]): string;

  decodeFunctionResult(functionFragment: 'MASTER_CHEF', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'MASTER_PID', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'TRI', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'add', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'emergencyWithdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'harvest', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'harvestFromMasterChef', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'init', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lpToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'massUpdatePools', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingTri', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewarder', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'set', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalAllocPoint', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'triPerBlock', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updatePool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'userInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdrawAndHarvest', data: BytesLike): Result;

  events: {
    'Deposit(address,uint256,uint256,address)': EventFragment;
    'EmergencyWithdraw(address,uint256,uint256,address)': EventFragment;
    'Harvest(address,uint256,uint256)': EventFragment;
    'LogInit()': EventFragment;
    'LogPoolAddition(uint256,uint256,address,address)': EventFragment;
    'LogSetPool(uint256,uint256,address,bool)': EventFragment;
    'LogUpdatePool(uint256,uint64,uint256,uint256)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'Withdraw(address,uint256,uint256,address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Deposit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'EmergencyWithdraw'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Harvest'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'LogInit'): EventFragment;
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

export interface LogInitEventObject {}
export type LogInitEvent = TypedEvent<[], LogInitEventObject>;

export type LogInitEventFilter = TypedEventFilter<LogInitEvent>;

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
  lastRewardBlock: BigNumber;
  lpSupply: BigNumber;
  accTriPerShare: BigNumber;
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

export interface TrisolarisMasterChef extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TrisolarisMasterChefInterface;

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
    MASTER_CHEF(overrides?: CallOverrides): Promise<[string]>;

    MASTER_PID(overrides?: CallOverrides): Promise<[BigNumber]>;

    TRI(overrides?: CallOverrides): Promise<[string]>;

    add(
      allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

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

    harvestFromMasterChef(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    init(dummyToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pendingTri(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { pending: BigNumber }>;

    poolInfo(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        accTriPerShare: BigNumber;
        lastRewardBlock: BigNumber;
        allocPoint: BigNumber;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<[BigNumber] & { pools: BigNumber }>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      overwrite: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    totalAllocPoint(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    triPerBlock(overrides?: CallOverrides): Promise<[BigNumber] & { amount: BigNumber }>;

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

  MASTER_CHEF(overrides?: CallOverrides): Promise<string>;

  MASTER_PID(overrides?: CallOverrides): Promise<BigNumber>;

  TRI(overrides?: CallOverrides): Promise<string>;

  add(
    allocPoint: BigNumberish,
    _lpToken: string,
    _rewarder: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

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

  harvestFromMasterChef(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  init(dummyToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  massUpdatePools(
    pids: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  pendingTri(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

  poolInfo(
    arg0: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      accTriPerShare: BigNumber;
      lastRewardBlock: BigNumber;
      allocPoint: BigNumber;
    }
  >;

  poolLength(overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  set(
    _pid: BigNumberish,
    _allocPoint: BigNumberish,
    _rewarder: string,
    overwrite: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  triPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

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
    MASTER_CHEF(overrides?: CallOverrides): Promise<string>;

    MASTER_PID(overrides?: CallOverrides): Promise<BigNumber>;

    TRI(overrides?: CallOverrides): Promise<string>;

    add(allocPoint: BigNumberish, _lpToken: string, _rewarder: string, overrides?: CallOverrides): Promise<void>;

    deposit(pid: BigNumberish, amount: BigNumberish, to: string, overrides?: CallOverrides): Promise<void>;

    emergencyWithdraw(pid: BigNumberish, to: string, overrides?: CallOverrides): Promise<void>;

    harvest(pid: BigNumberish, to: string, overrides?: CallOverrides): Promise<void>;

    harvestFromMasterChef(overrides?: CallOverrides): Promise<void>;

    init(dummyToken: string, overrides?: CallOverrides): Promise<void>;

    lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    massUpdatePools(pids: BigNumberish[], overrides?: CallOverrides): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    pendingTri(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

    poolInfo(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        accTriPerShare: BigNumber;
        lastRewardBlock: BigNumber;
        allocPoint: BigNumber;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      overwrite: boolean,
      overrides?: CallOverrides,
    ): Promise<void>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(newOwner: string, overrides?: CallOverrides): Promise<void>;

    triPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

    updatePool(pid: BigNumberish, overrides?: CallOverrides): Promise<MasterChefV2.PoolInfoStructOutput>;

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

    'LogInit()'(): LogInitEventFilter;
    LogInit(): LogInitEventFilter;

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
      lastRewardBlock?: null,
      lpSupply?: null,
      accTriPerShare?: null,
    ): LogUpdatePoolEventFilter;
    LogUpdatePool(
      pid?: BigNumberish | null,
      lastRewardBlock?: null,
      lpSupply?: null,
      accTriPerShare?: null,
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
    MASTER_CHEF(overrides?: CallOverrides): Promise<BigNumber>;

    MASTER_PID(overrides?: CallOverrides): Promise<BigNumber>;

    TRI(overrides?: CallOverrides): Promise<BigNumber>;

    add(
      allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

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

    harvestFromMasterChef(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    init(dummyToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pendingTri(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

    poolInfo(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      overwrite: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    triPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

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
    MASTER_CHEF(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MASTER_PID(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    TRI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    add(
      allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

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

    harvestFromMasterChef(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    init(
      dummyToken: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    lpToken(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingTri(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolInfo(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    rewarder(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      overwrite: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    totalAllocPoint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    triPerBlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

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
