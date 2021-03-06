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

export interface TraderJoeChefV3Interface extends utils.Interface {
  functions: {
    'JOE()': FunctionFragment;
    'MASTER_CHEF_V2()': FunctionFragment;
    'MASTER_PID()': FunctionFragment;
    'add(uint256,address,address)': FunctionFragment;
    'deposit(uint256,uint256)': FunctionFragment;
    'emergencyWithdraw(uint256)': FunctionFragment;
    'harvestFromMasterChef()': FunctionFragment;
    'init(address)': FunctionFragment;
    'joePerSec()': FunctionFragment;
    'massUpdatePools(uint256[])': FunctionFragment;
    'owner()': FunctionFragment;
    'pendingTokens(uint256,address)': FunctionFragment;
    'poolInfo(uint256)': FunctionFragment;
    'poolLength()': FunctionFragment;
    'renounceOwnership()': FunctionFragment;
    'set(uint256,uint256,address,bool)': FunctionFragment;
    'totalAllocPoint()': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
    'updatePool(uint256)': FunctionFragment;
    'userInfo(uint256,address)': FunctionFragment;
    'withdraw(uint256,uint256)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'JOE'
      | 'MASTER_CHEF_V2'
      | 'MASTER_PID'
      | 'add'
      | 'deposit'
      | 'emergencyWithdraw'
      | 'harvestFromMasterChef'
      | 'init'
      | 'joePerSec'
      | 'massUpdatePools'
      | 'owner'
      | 'pendingTokens'
      | 'poolInfo'
      | 'poolLength'
      | 'renounceOwnership'
      | 'set'
      | 'totalAllocPoint'
      | 'transferOwnership'
      | 'updatePool'
      | 'userInfo'
      | 'withdraw',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'JOE', values?: undefined): string;
  encodeFunctionData(functionFragment: 'MASTER_CHEF_V2', values?: undefined): string;
  encodeFunctionData(functionFragment: 'MASTER_PID', values?: undefined): string;
  encodeFunctionData(functionFragment: 'add', values: [BigNumberish, string, string]): string;
  encodeFunctionData(functionFragment: 'deposit', values: [BigNumberish, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'emergencyWithdraw', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'harvestFromMasterChef', values?: undefined): string;
  encodeFunctionData(functionFragment: 'init', values: [string]): string;
  encodeFunctionData(functionFragment: 'joePerSec', values?: undefined): string;
  encodeFunctionData(functionFragment: 'massUpdatePools', values: [BigNumberish[]]): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pendingTokens', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'poolInfo', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'poolLength', values?: undefined): string;
  encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'set', values: [BigNumberish, BigNumberish, string, boolean]): string;
  encodeFunctionData(functionFragment: 'totalAllocPoint', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [string]): string;
  encodeFunctionData(functionFragment: 'updatePool', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'userInfo', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'withdraw', values: [BigNumberish, BigNumberish]): string;

  decodeFunctionResult(functionFragment: 'JOE', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'MASTER_CHEF_V2', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'MASTER_PID', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'add', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'emergencyWithdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'harvestFromMasterChef', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'init', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'joePerSec', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'massUpdatePools', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingTokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'set', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalAllocPoint', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updatePool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'userInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;

  events: {
    'Add(uint256,uint256,address,address)': EventFragment;
    'Deposit(address,uint256,uint256)': EventFragment;
    'EmergencyWithdraw(address,uint256,uint256)': EventFragment;
    'Harvest(address,uint256,uint256)': EventFragment;
    'Init()': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'Set(uint256,uint256,address,bool)': EventFragment;
    'UpdatePool(uint256,uint256,uint256,uint256)': EventFragment;
    'Withdraw(address,uint256,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Add'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Deposit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'EmergencyWithdraw'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Harvest'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Init'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Set'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'UpdatePool'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdraw'): EventFragment;
}

export interface AddEventObject {
  pid: BigNumber;
  allocPoint: BigNumber;
  lpToken: string;
  rewarder: string;
}
export type AddEvent = TypedEvent<[BigNumber, BigNumber, string, string], AddEventObject>;

export type AddEventFilter = TypedEventFilter<AddEvent>;

export interface DepositEventObject {
  user: string;
  pid: BigNumber;
  amount: BigNumber;
}
export type DepositEvent = TypedEvent<[string, BigNumber, BigNumber], DepositEventObject>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface EmergencyWithdrawEventObject {
  user: string;
  pid: BigNumber;
  amount: BigNumber;
}
export type EmergencyWithdrawEvent = TypedEvent<[string, BigNumber, BigNumber], EmergencyWithdrawEventObject>;

export type EmergencyWithdrawEventFilter = TypedEventFilter<EmergencyWithdrawEvent>;

export interface HarvestEventObject {
  user: string;
  pid: BigNumber;
  amount: BigNumber;
}
export type HarvestEvent = TypedEvent<[string, BigNumber, BigNumber], HarvestEventObject>;

export type HarvestEventFilter = TypedEventFilter<HarvestEvent>;

export interface InitEventObject {}
export type InitEvent = TypedEvent<[], InitEventObject>;

export type InitEventFilter = TypedEventFilter<InitEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[string, string], OwnershipTransferredEventObject>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface SetEventObject {
  pid: BigNumber;
  allocPoint: BigNumber;
  rewarder: string;
  overwrite: boolean;
}
export type SetEvent = TypedEvent<[BigNumber, BigNumber, string, boolean], SetEventObject>;

export type SetEventFilter = TypedEventFilter<SetEvent>;

export interface UpdatePoolEventObject {
  pid: BigNumber;
  lastRewardTimestamp: BigNumber;
  lpSupply: BigNumber;
  accJoePerShare: BigNumber;
}
export type UpdatePoolEvent = TypedEvent<[BigNumber, BigNumber, BigNumber, BigNumber], UpdatePoolEventObject>;

export type UpdatePoolEventFilter = TypedEventFilter<UpdatePoolEvent>;

export interface WithdrawEventObject {
  user: string;
  pid: BigNumber;
  amount: BigNumber;
}
export type WithdrawEvent = TypedEvent<[string, BigNumber, BigNumber], WithdrawEventObject>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface TraderJoeChefV3 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TraderJoeChefV3Interface;

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
    JOE(overrides?: CallOverrides): Promise<[string]>;

    MASTER_CHEF_V2(overrides?: CallOverrides): Promise<[string]>;

    MASTER_PID(overrides?: CallOverrides): Promise<[BigNumber]>;

    add(
      allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    deposit(
      pid: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    emergencyWithdraw(
      pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    harvestFromMasterChef(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    init(dummyToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    joePerSec(overrides?: CallOverrides): Promise<[BigNumber] & { amount: BigNumber }>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pendingTokens(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, string, string, BigNumber] & {
        pendingJoe: BigNumber;
        bonusTokenAddress: string;
        bonusTokenSymbol: string;
        pendingBonusToken: BigNumber;
      }
    >;

    poolInfo(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, string] & {
        lpToken: string;
        accJoePerShare: BigNumber;
        lastRewardTimestamp: BigNumber;
        allocPoint: BigNumber;
        rewarder: string;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<[BigNumber] & { pools: BigNumber }>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

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
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;
  };

  JOE(overrides?: CallOverrides): Promise<string>;

  MASTER_CHEF_V2(overrides?: CallOverrides): Promise<string>;

  MASTER_PID(overrides?: CallOverrides): Promise<BigNumber>;

  add(
    allocPoint: BigNumberish,
    _lpToken: string,
    _rewarder: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  deposit(
    pid: BigNumberish,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  emergencyWithdraw(
    pid: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  harvestFromMasterChef(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  init(dummyToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  joePerSec(overrides?: CallOverrides): Promise<BigNumber>;

  massUpdatePools(
    pids: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  pendingTokens(
    _pid: BigNumberish,
    _user: string,
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, string, string, BigNumber] & {
      pendingJoe: BigNumber;
      bonusTokenAddress: string;
      bonusTokenSymbol: string;
      pendingBonusToken: BigNumber;
    }
  >;

  poolInfo(
    arg0: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<
    [string, BigNumber, BigNumber, BigNumber, string] & {
      lpToken: string;
      accJoePerShare: BigNumber;
      lastRewardTimestamp: BigNumber;
      allocPoint: BigNumber;
      rewarder: string;
    }
  >;

  poolLength(overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

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
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    JOE(overrides?: CallOverrides): Promise<string>;

    MASTER_CHEF_V2(overrides?: CallOverrides): Promise<string>;

    MASTER_PID(overrides?: CallOverrides): Promise<BigNumber>;

    add(allocPoint: BigNumberish, _lpToken: string, _rewarder: string, overrides?: CallOverrides): Promise<void>;

    deposit(pid: BigNumberish, amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    emergencyWithdraw(pid: BigNumberish, overrides?: CallOverrides): Promise<void>;

    harvestFromMasterChef(overrides?: CallOverrides): Promise<void>;

    init(dummyToken: string, overrides?: CallOverrides): Promise<void>;

    joePerSec(overrides?: CallOverrides): Promise<BigNumber>;

    massUpdatePools(pids: BigNumberish[], overrides?: CallOverrides): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    pendingTokens(
      _pid: BigNumberish,
      _user: string,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, string, string, BigNumber] & {
        pendingJoe: BigNumber;
        bonusTokenAddress: string;
        bonusTokenSymbol: string;
        pendingBonusToken: BigNumber;
      }
    >;

    poolInfo(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, string] & {
        lpToken: string;
        accJoePerShare: BigNumber;
        lastRewardTimestamp: BigNumber;
        allocPoint: BigNumber;
        rewarder: string;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      overwrite: boolean,
      overrides?: CallOverrides,
    ): Promise<void>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(newOwner: string, overrides?: CallOverrides): Promise<void>;

    updatePool(pid: BigNumberish, overrides?: CallOverrides): Promise<void>;

    userInfo(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;

    withdraw(pid: BigNumberish, amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    'Add(uint256,uint256,address,address)'(
      pid?: BigNumberish | null,
      allocPoint?: null,
      lpToken?: string | null,
      rewarder?: string | null,
    ): AddEventFilter;
    Add(
      pid?: BigNumberish | null,
      allocPoint?: null,
      lpToken?: string | null,
      rewarder?: string | null,
    ): AddEventFilter;

    'Deposit(address,uint256,uint256)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
    ): DepositEventFilter;
    Deposit(user?: string | null, pid?: BigNumberish | null, amount?: null): DepositEventFilter;

    'EmergencyWithdraw(address,uint256,uint256)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
    ): EmergencyWithdrawEventFilter;
    EmergencyWithdraw(user?: string | null, pid?: BigNumberish | null, amount?: null): EmergencyWithdrawEventFilter;

    'Harvest(address,uint256,uint256)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
    ): HarvestEventFilter;
    Harvest(user?: string | null, pid?: BigNumberish | null, amount?: null): HarvestEventFilter;

    'Init()'(): InitEventFilter;
    Init(): InitEventFilter;

    'OwnershipTransferred(address,address)'(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): OwnershipTransferredEventFilter;

    'Set(uint256,uint256,address,bool)'(
      pid?: BigNumberish | null,
      allocPoint?: null,
      rewarder?: string | null,
      overwrite?: null,
    ): SetEventFilter;
    Set(pid?: BigNumberish | null, allocPoint?: null, rewarder?: string | null, overwrite?: null): SetEventFilter;

    'UpdatePool(uint256,uint256,uint256,uint256)'(
      pid?: BigNumberish | null,
      lastRewardTimestamp?: null,
      lpSupply?: null,
      accJoePerShare?: null,
    ): UpdatePoolEventFilter;
    UpdatePool(
      pid?: BigNumberish | null,
      lastRewardTimestamp?: null,
      lpSupply?: null,
      accJoePerShare?: null,
    ): UpdatePoolEventFilter;

    'Withdraw(address,uint256,uint256)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
    ): WithdrawEventFilter;
    Withdraw(user?: string | null, pid?: BigNumberish | null, amount?: null): WithdrawEventFilter;
  };

  estimateGas: {
    JOE(overrides?: CallOverrides): Promise<BigNumber>;

    MASTER_CHEF_V2(overrides?: CallOverrides): Promise<BigNumber>;

    MASTER_PID(overrides?: CallOverrides): Promise<BigNumber>;

    add(
      allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    deposit(
      pid: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    emergencyWithdraw(
      pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    harvestFromMasterChef(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    init(dummyToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    joePerSec(overrides?: CallOverrides): Promise<BigNumber>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pendingTokens(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

    poolInfo(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

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

    updatePool(pid: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    userInfo(arg0: BigNumberish, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      pid: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    JOE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MASTER_CHEF_V2(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MASTER_PID(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    add(
      allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    deposit(
      pid: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    emergencyWithdraw(
      pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    harvestFromMasterChef(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    init(
      dummyToken: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    joePerSec(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    massUpdatePools(
      pids: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingTokens(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolInfo(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

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

    updatePool(
      pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    userInfo(arg0: BigNumberish, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      pid: BigNumberish,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;
  };
}
