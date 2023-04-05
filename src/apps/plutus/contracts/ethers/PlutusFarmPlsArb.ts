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
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from './common';

export interface PlutusFarmPlsArbInterface extends utils.Interface {
  functions: {
    'accPlsPerShare()': FunctionFragment;
    'acceptOwnership()': FunctionFragment;
    'deposit(uint128)': FunctionFragment;
    'depositFor(address,uint128)': FunctionFragment;
    'emergencyWithdraw()': FunctionFragment;
    'harvest()': FunctionFragment;
    'harvestFor(address)': FunctionFragment;
    'initialize(uint32)': FunctionFragment;
    'lastRewardSecond()': FunctionFragment;
    'owner()': FunctionFragment;
    'paused()': FunctionFragment;
    'pendingOwner()': FunctionFragment;
    'pendingRewards(address)': FunctionFragment;
    'pls()': FunctionFragment;
    'plsPerSecond()': FunctionFragment;
    'proxiableUUID()': FunctionFragment;
    'renounceOwnership()': FunctionFragment;
    'rewardPerShare(uint256)': FunctionFragment;
    'setEmission(uint128)': FunctionFragment;
    'setPaused(bool)': FunctionFragment;
    'setStartTime(uint32)': FunctionFragment;
    'setWhitelist(address)': FunctionFragment;
    'stakingToken()': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
    'updateHandler(address,bool)': FunctionFragment;
    'updateShares()': FunctionFragment;
    'upgradeTo(address)': FunctionFragment;
    'upgradeToAndCall(address,bytes)': FunctionFragment;
    'userInfo(address)': FunctionFragment;
    'whitelist()': FunctionFragment;
    'withdraw(uint128)': FunctionFragment;
    'withdrawFor(address,uint128)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'accPlsPerShare'
      | 'acceptOwnership'
      | 'deposit'
      | 'depositFor'
      | 'emergencyWithdraw'
      | 'harvest'
      | 'harvestFor'
      | 'initialize'
      | 'lastRewardSecond'
      | 'owner'
      | 'paused'
      | 'pendingOwner'
      | 'pendingRewards'
      | 'pls'
      | 'plsPerSecond'
      | 'proxiableUUID'
      | 'renounceOwnership'
      | 'rewardPerShare'
      | 'setEmission'
      | 'setPaused'
      | 'setStartTime'
      | 'setWhitelist'
      | 'stakingToken'
      | 'transferOwnership'
      | 'updateHandler'
      | 'updateShares'
      | 'upgradeTo'
      | 'upgradeToAndCall'
      | 'userInfo'
      | 'whitelist'
      | 'withdraw'
      | 'withdrawFor',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'accPlsPerShare', values?: undefined): string;
  encodeFunctionData(functionFragment: 'acceptOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'deposit', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(
    functionFragment: 'depositFor',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(functionFragment: 'emergencyWithdraw', values?: undefined): string;
  encodeFunctionData(functionFragment: 'harvest', values?: undefined): string;
  encodeFunctionData(functionFragment: 'harvestFor', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'initialize', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'lastRewardSecond', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'paused', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pendingOwner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pendingRewards', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'pls', values?: undefined): string;
  encodeFunctionData(functionFragment: 'plsPerSecond', values?: undefined): string;
  encodeFunctionData(functionFragment: 'proxiableUUID', values?: undefined): string;
  encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'rewardPerShare', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'setEmission', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'setPaused', values: [PromiseOrValue<boolean>]): string;
  encodeFunctionData(functionFragment: 'setStartTime', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'setWhitelist', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'stakingToken', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: 'updateHandler',
    values: [PromiseOrValue<string>, PromiseOrValue<boolean>],
  ): string;
  encodeFunctionData(functionFragment: 'updateShares', values?: undefined): string;
  encodeFunctionData(functionFragment: 'upgradeTo', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: 'upgradeToAndCall',
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>],
  ): string;
  encodeFunctionData(functionFragment: 'userInfo', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'whitelist', values?: undefined): string;
  encodeFunctionData(functionFragment: 'withdraw', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(
    functionFragment: 'withdrawFor',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;

  decodeFunctionResult(functionFragment: 'accPlsPerShare', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'acceptOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'depositFor', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'emergencyWithdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'harvest', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'harvestFor', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'initialize', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lastRewardSecond', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'paused', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingOwner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingRewards', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pls', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'plsPerSecond', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'proxiableUUID', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardPerShare', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setEmission', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setPaused', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setStartTime', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setWhitelist', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'stakingToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updateHandler', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updateShares', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'upgradeTo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'upgradeToAndCall', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'userInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'whitelist', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdrawFor', data: BytesLike): Result;

  events: {
    'AdminChanged(address,address)': EventFragment;
    'BeaconUpgraded(address)': EventFragment;
    'Deposit(address,uint256)': EventFragment;
    'EmergencyWithdraw(address,uint256)': EventFragment;
    'HandlerUpdated(address,bool)': EventFragment;
    'Harvest(address,uint256)': EventFragment;
    'Initialized(uint8)': EventFragment;
    'OwnershipTransferStarted(address,address)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'Paused(address)': EventFragment;
    'Unpaused(address)': EventFragment;
    'Upgraded(address)': EventFragment;
    'Withdraw(address,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'AdminChanged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'BeaconUpgraded'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Deposit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'EmergencyWithdraw'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'HandlerUpdated'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Harvest'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Initialized'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferStarted'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Paused'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Unpaused'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Upgraded'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdraw'): EventFragment;
}

export interface AdminChangedEventObject {
  previousAdmin: string;
  newAdmin: string;
}
export type AdminChangedEvent = TypedEvent<[string, string], AdminChangedEventObject>;

export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;

export interface BeaconUpgradedEventObject {
  beacon: string;
}
export type BeaconUpgradedEvent = TypedEvent<[string], BeaconUpgradedEventObject>;

export type BeaconUpgradedEventFilter = TypedEventFilter<BeaconUpgradedEvent>;

export interface DepositEventObject {
  _user: string;
  _amount: BigNumber;
}
export type DepositEvent = TypedEvent<[string, BigNumber], DepositEventObject>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface EmergencyWithdrawEventObject {
  _user: string;
  _amount: BigNumber;
}
export type EmergencyWithdrawEvent = TypedEvent<[string, BigNumber], EmergencyWithdrawEventObject>;

export type EmergencyWithdrawEventFilter = TypedEventFilter<EmergencyWithdrawEvent>;

export interface HandlerUpdatedEventObject {
  _handler: string;
  _isActive: boolean;
}
export type HandlerUpdatedEvent = TypedEvent<[string, boolean], HandlerUpdatedEventObject>;

export type HandlerUpdatedEventFilter = TypedEventFilter<HandlerUpdatedEvent>;

export interface HarvestEventObject {
  _user: string;
  _amount: BigNumber;
}
export type HarvestEvent = TypedEvent<[string, BigNumber], HarvestEventObject>;

export type HarvestEventFilter = TypedEventFilter<HarvestEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface OwnershipTransferStartedEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferStartedEvent = TypedEvent<[string, string], OwnershipTransferStartedEventObject>;

export type OwnershipTransferStartedEventFilter = TypedEventFilter<OwnershipTransferStartedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[string, string], OwnershipTransferredEventObject>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface PausedEventObject {
  account: string;
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export interface UnpausedEventObject {
  account: string;
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export interface UpgradedEventObject {
  implementation: string;
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>;

export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;

export interface WithdrawEventObject {
  _user: string;
  _amount: BigNumber;
}
export type WithdrawEvent = TypedEvent<[string, BigNumber], WithdrawEventObject>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface PlutusFarmPlsArb extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PlutusFarmPlsArbInterface;

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
    accPlsPerShare(overrides?: CallOverrides): Promise<[BigNumber]>;

    acceptOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    deposit(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    depositFor(
      _user: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    emergencyWithdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    harvest(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    harvestFor(
      _user: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    initialize(
      _rewardEmissionStart: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    lastRewardSecond(overrides?: CallOverrides): Promise<[number]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    pendingOwner(overrides?: CallOverrides): Promise<[string]>;

    pendingRewards(
      _user: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { _pendingPls: BigNumber }>;

    pls(overrides?: CallOverrides): Promise<[string]>;

    plsPerSecond(overrides?: CallOverrides): Promise<[BigNumber]>;

    proxiableUUID(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    rewardPerShare(_rewardRatePerSecond: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;

    setEmission(
      _plsPerSecond: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setPaused(
      _pauseContract: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setStartTime(
      _startTime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setWhitelist(
      _whitelist: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    stakingToken(overrides?: CallOverrides): Promise<[string]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    updateHandler(
      _handler: PromiseOrValue<string>,
      _isActive: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    updateShares(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    upgradeTo(
      newImplementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    userInfo(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; plsRewardDebt: BigNumber }>;

    whitelist(overrides?: CallOverrides): Promise<[string]>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    withdrawFor(
      _user: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;
  };

  accPlsPerShare(overrides?: CallOverrides): Promise<BigNumber>;

  acceptOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  deposit(
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  depositFor(
    _user: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  emergencyWithdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  harvest(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  harvestFor(
    _user: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  initialize(
    _rewardEmissionStart: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  lastRewardSecond(overrides?: CallOverrides): Promise<number>;

  owner(overrides?: CallOverrides): Promise<string>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  pendingOwner(overrides?: CallOverrides): Promise<string>;

  pendingRewards(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  pls(overrides?: CallOverrides): Promise<string>;

  plsPerSecond(overrides?: CallOverrides): Promise<BigNumber>;

  proxiableUUID(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  rewardPerShare(_rewardRatePerSecond: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

  setEmission(
    _plsPerSecond: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setPaused(
    _pauseContract: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setStartTime(
    _startTime: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setWhitelist(
    _whitelist: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  stakingToken(overrides?: CallOverrides): Promise<string>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  updateHandler(
    _handler: PromiseOrValue<string>,
    _isActive: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  updateShares(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  upgradeTo(
    newImplementation: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  upgradeToAndCall(
    newImplementation: PromiseOrValue<string>,
    data: PromiseOrValue<BytesLike>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  userInfo(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; plsRewardDebt: BigNumber }>;

  whitelist(overrides?: CallOverrides): Promise<string>;

  withdraw(
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  withdrawFor(
    _user: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    accPlsPerShare(overrides?: CallOverrides): Promise<BigNumber>;

    acceptOwnership(overrides?: CallOverrides): Promise<void>;

    deposit(_amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;

    depositFor(
      _user: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    emergencyWithdraw(overrides?: CallOverrides): Promise<void>;

    harvest(overrides?: CallOverrides): Promise<void>;

    harvestFor(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    initialize(_rewardEmissionStart: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;

    lastRewardSecond(overrides?: CallOverrides): Promise<number>;

    owner(overrides?: CallOverrides): Promise<string>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    pendingOwner(overrides?: CallOverrides): Promise<string>;

    pendingRewards(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    pls(overrides?: CallOverrides): Promise<string>;

    plsPerSecond(overrides?: CallOverrides): Promise<BigNumber>;

    proxiableUUID(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardPerShare(_rewardRatePerSecond: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    setEmission(_plsPerSecond: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;

    setPaused(_pauseContract: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;

    setStartTime(_startTime: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;

    setWhitelist(_whitelist: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    stakingToken(overrides?: CallOverrides): Promise<string>;

    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    updateHandler(
      _handler: PromiseOrValue<string>,
      _isActive: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<void>;

    updateShares(overrides?: CallOverrides): Promise<void>;

    upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<void>;

    userInfo(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; plsRewardDebt: BigNumber }>;

    whitelist(overrides?: CallOverrides): Promise<string>;

    withdraw(_amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;

    withdrawFor(
      _user: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;
  };

  filters: {
    'AdminChanged(address,address)'(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
    AdminChanged(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;

    'BeaconUpgraded(address)'(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
    BeaconUpgraded(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;

    'Deposit(address,uint256)'(_user?: PromiseOrValue<string> | null, _amount?: null): DepositEventFilter;
    Deposit(_user?: PromiseOrValue<string> | null, _amount?: null): DepositEventFilter;

    'EmergencyWithdraw(address,uint256)'(
      _user?: PromiseOrValue<string> | null,
      _amount?: null,
    ): EmergencyWithdrawEventFilter;
    EmergencyWithdraw(_user?: PromiseOrValue<string> | null, _amount?: null): EmergencyWithdrawEventFilter;

    'HandlerUpdated(address,bool)'(
      _handler?: PromiseOrValue<string> | null,
      _isActive?: null,
    ): HandlerUpdatedEventFilter;
    HandlerUpdated(_handler?: PromiseOrValue<string> | null, _isActive?: null): HandlerUpdatedEventFilter;

    'Harvest(address,uint256)'(_user?: PromiseOrValue<string> | null, _amount?: null): HarvestEventFilter;
    Harvest(_user?: PromiseOrValue<string> | null, _amount?: null): HarvestEventFilter;

    'Initialized(uint8)'(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    'OwnershipTransferStarted(address,address)'(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferStartedEventFilter;
    OwnershipTransferStarted(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferStartedEventFilter;

    'OwnershipTransferred(address,address)'(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter;

    'Paused(address)'(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    'Unpaused(address)'(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;

    'Upgraded(address)'(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
    Upgraded(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;

    'Withdraw(address,uint256)'(_user?: PromiseOrValue<string> | null, _amount?: null): WithdrawEventFilter;
    Withdraw(_user?: PromiseOrValue<string> | null, _amount?: null): WithdrawEventFilter;
  };

  estimateGas: {
    accPlsPerShare(overrides?: CallOverrides): Promise<BigNumber>;

    acceptOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    deposit(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    depositFor(
      _user: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    emergencyWithdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    harvest(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    harvestFor(
      _user: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    initialize(
      _rewardEmissionStart: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    lastRewardSecond(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    pendingOwner(overrides?: CallOverrides): Promise<BigNumber>;

    pendingRewards(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    pls(overrides?: CallOverrides): Promise<BigNumber>;

    plsPerSecond(overrides?: CallOverrides): Promise<BigNumber>;

    proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    rewardPerShare(_rewardRatePerSecond: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    setEmission(
      _plsPerSecond: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setPaused(
      _pauseContract: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setStartTime(
      _startTime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setWhitelist(
      _whitelist: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    stakingToken(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    updateHandler(
      _handler: PromiseOrValue<string>,
      _isActive: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    updateShares(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    upgradeTo(
      newImplementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    userInfo(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    whitelist(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    withdrawFor(
      _user: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    accPlsPerShare(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    acceptOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    deposit(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    depositFor(
      _user: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    emergencyWithdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    harvest(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    harvestFor(
      _user: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    initialize(
      _rewardEmissionStart: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    lastRewardSecond(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingRewards(_user: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pls(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    plsPerSecond(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    rewardPerShare(
      _rewardRatePerSecond: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    setEmission(
      _plsPerSecond: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setPaused(
      _pauseContract: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setStartTime(
      _startTime: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setWhitelist(
      _whitelist: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    stakingToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    updateHandler(
      _handler: PromiseOrValue<string>,
      _isActive: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    updateShares(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    upgradeTo(
      newImplementation: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    userInfo(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    whitelist(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    withdrawFor(
      _user: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;
  };
}
