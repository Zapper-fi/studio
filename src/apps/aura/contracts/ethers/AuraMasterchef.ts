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

export interface AuraMasterchefInterface extends utils.Interface {
  functions: {
    'BONUS_MULTIPLIER()': FunctionFragment;
    'add(uint256,address,address)': FunctionFragment;
    'claim(uint256,address)': FunctionFragment;
    'cvx()': FunctionFragment;
    'deposit(uint256,uint256)': FunctionFragment;
    'emergencyWithdraw(uint256)': FunctionFragment;
    'endBlock()': FunctionFragment;
    'getMultiplier(uint256,uint256)': FunctionFragment;
    'isAddedPool(address)': FunctionFragment;
    'massUpdatePools()': FunctionFragment;
    'owner()': FunctionFragment;
    'pendingCvx(uint256,address)': FunctionFragment;
    'poolInfo(uint256)': FunctionFragment;
    'poolLength()': FunctionFragment;
    'renounceOwnership()': FunctionFragment;
    'rewardPerBlock()': FunctionFragment;
    'set(uint256,uint256,address,bool)': FunctionFragment;
    'startBlock()': FunctionFragment;
    'totalAllocPoint()': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
    'updatePool(uint256)': FunctionFragment;
    'userInfo(uint256,address)': FunctionFragment;
    'withdraw(uint256,uint256)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'BONUS_MULTIPLIER'
      | 'add'
      | 'claim'
      | 'cvx'
      | 'deposit'
      | 'emergencyWithdraw'
      | 'endBlock'
      | 'getMultiplier'
      | 'isAddedPool'
      | 'massUpdatePools'
      | 'owner'
      | 'pendingCvx'
      | 'poolInfo'
      | 'poolLength'
      | 'renounceOwnership'
      | 'rewardPerBlock'
      | 'set'
      | 'startBlock'
      | 'totalAllocPoint'
      | 'transferOwnership'
      | 'updatePool'
      | 'userInfo'
      | 'withdraw',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'BONUS_MULTIPLIER', values?: undefined): string;
  encodeFunctionData(functionFragment: 'add', values: [BigNumberish, string, string]): string;
  encodeFunctionData(functionFragment: 'claim', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'cvx', values?: undefined): string;
  encodeFunctionData(functionFragment: 'deposit', values: [BigNumberish, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'emergencyWithdraw', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'endBlock', values?: undefined): string;
  encodeFunctionData(functionFragment: 'getMultiplier', values: [BigNumberish, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'isAddedPool', values: [string]): string;
  encodeFunctionData(functionFragment: 'massUpdatePools', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pendingCvx', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'poolInfo', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'poolLength', values?: undefined): string;
  encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'rewardPerBlock', values?: undefined): string;
  encodeFunctionData(functionFragment: 'set', values: [BigNumberish, BigNumberish, string, boolean]): string;
  encodeFunctionData(functionFragment: 'startBlock', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalAllocPoint', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [string]): string;
  encodeFunctionData(functionFragment: 'updatePool', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'userInfo', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'withdraw', values: [BigNumberish, BigNumberish]): string;

  decodeFunctionResult(functionFragment: 'BONUS_MULTIPLIER', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'add', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claim', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'cvx', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'emergencyWithdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'endBlock', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getMultiplier', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'isAddedPool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'massUpdatePools', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingCvx', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardPerBlock', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'set', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'startBlock', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalAllocPoint', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updatePool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'userInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;

  events: {
    'Deposit(address,uint256,uint256)': EventFragment;
    'EmergencyWithdraw(address,uint256,uint256)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'RewardPaid(address,uint256,uint256)': EventFragment;
    'Withdraw(address,uint256,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Deposit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'EmergencyWithdraw'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'RewardPaid'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdraw'): EventFragment;
}

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

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[string, string], OwnershipTransferredEventObject>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface RewardPaidEventObject {
  user: string;
  pid: BigNumber;
  amount: BigNumber;
}
export type RewardPaidEvent = TypedEvent<[string, BigNumber, BigNumber], RewardPaidEventObject>;

export type RewardPaidEventFilter = TypedEventFilter<RewardPaidEvent>;

export interface WithdrawEventObject {
  user: string;
  pid: BigNumber;
  amount: BigNumber;
}
export type WithdrawEvent = TypedEvent<[string, BigNumber, BigNumber], WithdrawEventObject>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface AuraMasterchef extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AuraMasterchefInterface;

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
    BONUS_MULTIPLIER(overrides?: CallOverrides): Promise<[BigNumber]>;

    add(
      _allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    claim(
      _pid: BigNumberish,
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    cvx(overrides?: CallOverrides): Promise<[string]>;

    deposit(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    emergencyWithdraw(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    endBlock(overrides?: CallOverrides): Promise<[BigNumber]>;

    getMultiplier(_from: BigNumberish, _to: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    isAddedPool(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    massUpdatePools(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pendingCvx(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    poolInfo(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, string] & {
        lpToken: string;
        allocPoint: BigNumber;
        lastRewardBlock: BigNumber;
        accCvxPerShare: BigNumber;
        rewarder: string;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    rewardPerBlock(overrides?: CallOverrides): Promise<[BigNumber]>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      _updateRewarder: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    startBlock(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalAllocPoint(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    updatePool(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    userInfo(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;

    withdraw(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;
  };

  BONUS_MULTIPLIER(overrides?: CallOverrides): Promise<BigNumber>;

  add(
    _allocPoint: BigNumberish,
    _lpToken: string,
    _rewarder: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  claim(
    _pid: BigNumberish,
    _account: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  cvx(overrides?: CallOverrides): Promise<string>;

  deposit(
    _pid: BigNumberish,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  emergencyWithdraw(
    _pid: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  endBlock(overrides?: CallOverrides): Promise<BigNumber>;

  getMultiplier(_from: BigNumberish, _to: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  isAddedPool(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  massUpdatePools(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  pendingCvx(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

  poolInfo(
    arg0: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<
    [string, BigNumber, BigNumber, BigNumber, string] & {
      lpToken: string;
      allocPoint: BigNumber;
      lastRewardBlock: BigNumber;
      accCvxPerShare: BigNumber;
      rewarder: string;
    }
  >;

  poolLength(overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  rewardPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

  set(
    _pid: BigNumberish,
    _allocPoint: BigNumberish,
    _rewarder: string,
    _updateRewarder: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  startBlock(overrides?: CallOverrides): Promise<BigNumber>;

  totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  updatePool(
    _pid: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  userInfo(
    arg0: BigNumberish,
    arg1: string,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;

  withdraw(
    _pid: BigNumberish,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    BONUS_MULTIPLIER(overrides?: CallOverrides): Promise<BigNumber>;

    add(_allocPoint: BigNumberish, _lpToken: string, _rewarder: string, overrides?: CallOverrides): Promise<void>;

    claim(_pid: BigNumberish, _account: string, overrides?: CallOverrides): Promise<void>;

    cvx(overrides?: CallOverrides): Promise<string>;

    deposit(_pid: BigNumberish, _amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    emergencyWithdraw(_pid: BigNumberish, overrides?: CallOverrides): Promise<void>;

    endBlock(overrides?: CallOverrides): Promise<BigNumber>;

    getMultiplier(_from: BigNumberish, _to: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    isAddedPool(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    massUpdatePools(overrides?: CallOverrides): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    pendingCvx(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

    poolInfo(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, string] & {
        lpToken: string;
        allocPoint: BigNumber;
        lastRewardBlock: BigNumber;
        accCvxPerShare: BigNumber;
        rewarder: string;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      _updateRewarder: boolean,
      overrides?: CallOverrides,
    ): Promise<void>;

    startBlock(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(newOwner: string, overrides?: CallOverrides): Promise<void>;

    updatePool(_pid: BigNumberish, overrides?: CallOverrides): Promise<void>;

    userInfo(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;

    withdraw(_pid: BigNumberish, _amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
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

    'OwnershipTransferred(address,address)'(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): OwnershipTransferredEventFilter;

    'RewardPaid(address,uint256,uint256)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
    ): RewardPaidEventFilter;
    RewardPaid(user?: string | null, pid?: BigNumberish | null, amount?: null): RewardPaidEventFilter;

    'Withdraw(address,uint256,uint256)'(
      user?: string | null,
      pid?: BigNumberish | null,
      amount?: null,
    ): WithdrawEventFilter;
    Withdraw(user?: string | null, pid?: BigNumberish | null, amount?: null): WithdrawEventFilter;
  };

  estimateGas: {
    BONUS_MULTIPLIER(overrides?: CallOverrides): Promise<BigNumber>;

    add(
      _allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    claim(
      _pid: BigNumberish,
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    cvx(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    emergencyWithdraw(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    endBlock(overrides?: CallOverrides): Promise<BigNumber>;

    getMultiplier(_from: BigNumberish, _to: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    isAddedPool(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    massUpdatePools(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pendingCvx(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<BigNumber>;

    poolInfo(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    rewardPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      _updateRewarder: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    startBlock(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    updatePool(_pid: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    userInfo(arg0: BigNumberish, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    BONUS_MULTIPLIER(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    add(
      _allocPoint: BigNumberish,
      _lpToken: string,
      _rewarder: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    claim(
      _pid: BigNumberish,
      _account: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    cvx(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    emergencyWithdraw(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    endBlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getMultiplier(_from: BigNumberish, _to: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isAddedPool(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    massUpdatePools(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingCvx(_pid: BigNumberish, _user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolInfo(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    rewardPerBlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    set(
      _pid: BigNumberish,
      _allocPoint: BigNumberish,
      _rewarder: string,
      _updateRewarder: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    startBlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalAllocPoint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    updatePool(
      _pid: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    userInfo(arg0: BigNumberish, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      _pid: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;
  };
}
