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
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from './common';

export interface RadiantCapitalStakingInterface extends utils.Interface {
  functions: {
    'addPool(address,uint256)': FunctionFragment;
    'batchUpdateAllocPoint(address[],uint256[])': FunctionFragment;
    'claim(address,address[])': FunctionFragment;
    'claimReceiver(address)': FunctionFragment;
    'claimableReward(address,address[])': FunctionFragment;
    'deposit(address,uint256)': FunctionFragment;
    'emergencyWithdraw(address)': FunctionFragment;
    'emissionSchedule(uint256)': FunctionFragment;
    'maxMintableTokens()': FunctionFragment;
    'mintedTokens()': FunctionFragment;
    'owner()': FunctionFragment;
    'poolConfigurator()': FunctionFragment;
    'poolInfo(address)': FunctionFragment;
    'poolLength()': FunctionFragment;
    'registeredTokens(uint256)': FunctionFragment;
    'renounceOwnership()': FunctionFragment;
    'rewardMinter()': FunctionFragment;
    'rewardsPerSecond()': FunctionFragment;
    'setClaimReceiver(address,address)': FunctionFragment;
    'setOnwardIncentives(address,address)': FunctionFragment;
    'start()': FunctionFragment;
    'startTime()': FunctionFragment;
    'totalAllocPoint()': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
    'userBaseClaimable(address)': FunctionFragment;
    'userInfo(address,address)': FunctionFragment;
    'withdraw(address,uint256)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'addPool'
      | 'batchUpdateAllocPoint'
      | 'claim'
      | 'claimReceiver'
      | 'claimableReward'
      | 'deposit'
      | 'emergencyWithdraw'
      | 'emissionSchedule'
      | 'maxMintableTokens'
      | 'mintedTokens'
      | 'owner'
      | 'poolConfigurator'
      | 'poolInfo'
      | 'poolLength'
      | 'registeredTokens'
      | 'renounceOwnership'
      | 'rewardMinter'
      | 'rewardsPerSecond'
      | 'setClaimReceiver'
      | 'setOnwardIncentives'
      | 'start'
      | 'startTime'
      | 'totalAllocPoint'
      | 'transferOwnership'
      | 'userBaseClaimable'
      | 'userInfo'
      | 'withdraw',
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: 'addPool',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: 'batchUpdateAllocPoint',
    values: [PromiseOrValue<string>[], PromiseOrValue<BigNumberish>[]],
  ): string;
  encodeFunctionData(functionFragment: 'claim', values: [PromiseOrValue<string>, PromiseOrValue<string>[]]): string;
  encodeFunctionData(functionFragment: 'claimReceiver', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: 'claimableReward',
    values: [PromiseOrValue<string>, PromiseOrValue<string>[]],
  ): string;
  encodeFunctionData(
    functionFragment: 'deposit',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(functionFragment: 'emergencyWithdraw', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'emissionSchedule', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'maxMintableTokens', values?: undefined): string;
  encodeFunctionData(functionFragment: 'mintedTokens', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'poolConfigurator', values?: undefined): string;
  encodeFunctionData(functionFragment: 'poolInfo', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'poolLength', values?: undefined): string;
  encodeFunctionData(functionFragment: 'registeredTokens', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'rewardMinter', values?: undefined): string;
  encodeFunctionData(functionFragment: 'rewardsPerSecond', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'setClaimReceiver',
    values: [PromiseOrValue<string>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: 'setOnwardIncentives',
    values: [PromiseOrValue<string>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(functionFragment: 'start', values?: undefined): string;
  encodeFunctionData(functionFragment: 'startTime', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalAllocPoint', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'userBaseClaimable', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'userInfo', values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: 'withdraw',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;

  decodeFunctionResult(functionFragment: 'addPool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'batchUpdateAllocPoint', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claim', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimReceiver', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimableReward', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'emergencyWithdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'emissionSchedule', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'maxMintableTokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'mintedTokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolConfigurator', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'registeredTokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardMinter', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardsPerSecond', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setClaimReceiver', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setOnwardIncentives', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'start', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'startTime', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalAllocPoint', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'userBaseClaimable', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'userInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;

  events: {
    'Deposit(address,address,uint256)': EventFragment;
    'EmergencyWithdraw(address,address,uint256)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'Withdraw(address,address,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Deposit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'EmergencyWithdraw'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdraw'): EventFragment;
}

export interface DepositEventObject {
  token: string;
  user: string;
  amount: BigNumber;
}
export type DepositEvent = TypedEvent<[string, string, BigNumber], DepositEventObject>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface EmergencyWithdrawEventObject {
  token: string;
  user: string;
  amount: BigNumber;
}
export type EmergencyWithdrawEvent = TypedEvent<[string, string, BigNumber], EmergencyWithdrawEventObject>;

export type EmergencyWithdrawEventFilter = TypedEventFilter<EmergencyWithdrawEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[string, string], OwnershipTransferredEventObject>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface WithdrawEventObject {
  token: string;
  user: string;
  amount: BigNumber;
}
export type WithdrawEvent = TypedEvent<[string, string, BigNumber], WithdrawEventObject>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface RadiantCapitalStaking extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RadiantCapitalStakingInterface;

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
    addPool(
      _token: PromiseOrValue<string>,
      _allocPoint: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    batchUpdateAllocPoint(
      _tokens: PromiseOrValue<string>[],
      _allocPoints: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    claim(
      _user: PromiseOrValue<string>,
      _tokens: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    claimReceiver(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;

    claimableReward(
      _user: PromiseOrValue<string>,
      _tokens: PromiseOrValue<string>[],
      overrides?: CallOverrides,
    ): Promise<[BigNumber[]]>;

    deposit(
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    emergencyWithdraw(
      _token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    emissionSchedule(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber] & {
        startTimeOffset: BigNumber;
        rewardsPerSecond: BigNumber;
      }
    >;

    maxMintableTokens(overrides?: CallOverrides): Promise<[BigNumber]>;

    mintedTokens(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    poolConfigurator(overrides?: CallOverrides): Promise<[string]>;

    poolInfo(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, string] & {
        allocPoint: BigNumber;
        lastRewardTime: BigNumber;
        accRewardPerShare: BigNumber;
        onwardIncentives: string;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    registeredTokens(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    rewardMinter(overrides?: CallOverrides): Promise<[string]>;

    rewardsPerSecond(overrides?: CallOverrides): Promise<[BigNumber]>;

    setClaimReceiver(
      _user: PromiseOrValue<string>,
      _receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setOnwardIncentives(
      _token: PromiseOrValue<string>,
      _incentives: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    start(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    startTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalAllocPoint(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    userBaseClaimable(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    userInfo(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;

    withdraw(
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;
  };

  addPool(
    _token: PromiseOrValue<string>,
    _allocPoint: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  batchUpdateAllocPoint(
    _tokens: PromiseOrValue<string>[],
    _allocPoints: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  claim(
    _user: PromiseOrValue<string>,
    _tokens: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  claimReceiver(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;

  claimableReward(
    _user: PromiseOrValue<string>,
    _tokens: PromiseOrValue<string>[],
    overrides?: CallOverrides,
  ): Promise<BigNumber[]>;

  deposit(
    _token: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  emergencyWithdraw(
    _token: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  emissionSchedule(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, BigNumber] & {
      startTimeOffset: BigNumber;
      rewardsPerSecond: BigNumber;
    }
  >;

  maxMintableTokens(overrides?: CallOverrides): Promise<BigNumber>;

  mintedTokens(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  poolConfigurator(overrides?: CallOverrides): Promise<string>;

  poolInfo(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, BigNumber, BigNumber, string] & {
      allocPoint: BigNumber;
      lastRewardTime: BigNumber;
      accRewardPerShare: BigNumber;
      onwardIncentives: string;
    }
  >;

  poolLength(overrides?: CallOverrides): Promise<BigNumber>;

  registeredTokens(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;

  renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  rewardMinter(overrides?: CallOverrides): Promise<string>;

  rewardsPerSecond(overrides?: CallOverrides): Promise<BigNumber>;

  setClaimReceiver(
    _user: PromiseOrValue<string>,
    _receiver: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setOnwardIncentives(
    _token: PromiseOrValue<string>,
    _incentives: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  start(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  startTime(overrides?: CallOverrides): Promise<BigNumber>;

  totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  userBaseClaimable(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  userInfo(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;

  withdraw(
    _token: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    addPool(
      _token: PromiseOrValue<string>,
      _allocPoint: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    batchUpdateAllocPoint(
      _tokens: PromiseOrValue<string>[],
      _allocPoints: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides,
    ): Promise<void>;

    claim(_user: PromiseOrValue<string>, _tokens: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;

    claimReceiver(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;

    claimableReward(
      _user: PromiseOrValue<string>,
      _tokens: PromiseOrValue<string>[],
      overrides?: CallOverrides,
    ): Promise<BigNumber[]>;

    deposit(
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    emergencyWithdraw(_token: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    emissionSchedule(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber] & {
        startTimeOffset: BigNumber;
        rewardsPerSecond: BigNumber;
      }
    >;

    maxMintableTokens(overrides?: CallOverrides): Promise<BigNumber>;

    mintedTokens(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    poolConfigurator(overrides?: CallOverrides): Promise<string>;

    poolInfo(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, string] & {
        allocPoint: BigNumber;
        lastRewardTime: BigNumber;
        accRewardPerShare: BigNumber;
        onwardIncentives: string;
      }
    >;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    registeredTokens(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardMinter(overrides?: CallOverrides): Promise<string>;

    rewardsPerSecond(overrides?: CallOverrides): Promise<BigNumber>;

    setClaimReceiver(
      _user: PromiseOrValue<string>,
      _receiver: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;

    setOnwardIncentives(
      _token: PromiseOrValue<string>,
      _incentives: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;

    start(overrides?: CallOverrides): Promise<void>;

    startTime(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    userBaseClaimable(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    userInfo(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; rewardDebt: BigNumber }>;

    withdraw(
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;
  };

  filters: {
    'Deposit(address,address,uint256)'(
      token?: PromiseOrValue<string> | null,
      user?: PromiseOrValue<string> | null,
      amount?: null,
    ): DepositEventFilter;
    Deposit(
      token?: PromiseOrValue<string> | null,
      user?: PromiseOrValue<string> | null,
      amount?: null,
    ): DepositEventFilter;

    'EmergencyWithdraw(address,address,uint256)'(
      token?: PromiseOrValue<string> | null,
      user?: PromiseOrValue<string> | null,
      amount?: null,
    ): EmergencyWithdrawEventFilter;
    EmergencyWithdraw(
      token?: PromiseOrValue<string> | null,
      user?: PromiseOrValue<string> | null,
      amount?: null,
    ): EmergencyWithdrawEventFilter;

    'OwnershipTransferred(address,address)'(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter;

    'Withdraw(address,address,uint256)'(
      token?: PromiseOrValue<string> | null,
      user?: PromiseOrValue<string> | null,
      amount?: null,
    ): WithdrawEventFilter;
    Withdraw(
      token?: PromiseOrValue<string> | null,
      user?: PromiseOrValue<string> | null,
      amount?: null,
    ): WithdrawEventFilter;
  };

  estimateGas: {
    addPool(
      _token: PromiseOrValue<string>,
      _allocPoint: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    batchUpdateAllocPoint(
      _tokens: PromiseOrValue<string>[],
      _allocPoints: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    claim(
      _user: PromiseOrValue<string>,
      _tokens: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    claimReceiver(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    claimableReward(
      _user: PromiseOrValue<string>,
      _tokens: PromiseOrValue<string>[],
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    deposit(
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    emergencyWithdraw(
      _token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    emissionSchedule(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    maxMintableTokens(overrides?: CallOverrides): Promise<BigNumber>;

    mintedTokens(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    poolConfigurator(overrides?: CallOverrides): Promise<BigNumber>;

    poolInfo(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    poolLength(overrides?: CallOverrides): Promise<BigNumber>;

    registeredTokens(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    rewardMinter(overrides?: CallOverrides): Promise<BigNumber>;

    rewardsPerSecond(overrides?: CallOverrides): Promise<BigNumber>;

    setClaimReceiver(
      _user: PromiseOrValue<string>,
      _receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setOnwardIncentives(
      _token: PromiseOrValue<string>,
      _incentives: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    start(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    startTime(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    userBaseClaimable(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    userInfo(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addPool(
      _token: PromiseOrValue<string>,
      _allocPoint: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    batchUpdateAllocPoint(
      _tokens: PromiseOrValue<string>[],
      _allocPoints: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    claim(
      _user: PromiseOrValue<string>,
      _tokens: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    claimReceiver(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimableReward(
      _user: PromiseOrValue<string>,
      _tokens: PromiseOrValue<string>[],
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    deposit(
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    emergencyWithdraw(
      _token: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    emissionSchedule(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxMintableTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    mintedTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolConfigurator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolInfo(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    registeredTokens(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    rewardMinter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardsPerSecond(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setClaimReceiver(
      _user: PromiseOrValue<string>,
      _receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setOnwardIncentives(
      _token: PromiseOrValue<string>,
      _incentives: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    start(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    startTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalAllocPoint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    userBaseClaimable(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    userInfo(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    withdraw(
      _token: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;
  };
}
