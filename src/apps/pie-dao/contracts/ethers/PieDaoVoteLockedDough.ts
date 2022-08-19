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

export declare namespace SharesTimeLock {
  export type LockStruct = {
    amount: PromiseOrValue<BigNumberish>;
    lockedAt: PromiseOrValue<BigNumberish>;
    lockDuration: PromiseOrValue<BigNumberish>;
  };

  export type LockStructOutput = [BigNumber, number, number] & {
    amount: BigNumber;
    lockedAt: number;
    lockDuration: number;
  };

  export type StakingDataStruct = {
    totalStaked: PromiseOrValue<BigNumberish>;
    veTokenTotalSupply: PromiseOrValue<BigNumberish>;
    accountVeTokenBalance: PromiseOrValue<BigNumberish>;
    accountWithdrawableRewards: PromiseOrValue<BigNumberish>;
    accountWithdrawnRewards: PromiseOrValue<BigNumberish>;
    accountDepositTokenBalance: PromiseOrValue<BigNumberish>;
    accountDepositTokenAllowance: PromiseOrValue<BigNumberish>;
    accountLocks: SharesTimeLock.LockStruct[];
  };

  export type StakingDataStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    SharesTimeLock.LockStructOutput[],
  ] & {
    totalStaked: BigNumber;
    veTokenTotalSupply: BigNumber;
    accountVeTokenBalance: BigNumber;
    accountWithdrawableRewards: BigNumber;
    accountWithdrawnRewards: BigNumber;
    accountDepositTokenBalance: BigNumber;
    accountDepositTokenAllowance: BigNumber;
    accountLocks: SharesTimeLock.LockStructOutput[];
  };
}

export interface PieDaoVoteLockedDoughInterface extends utils.Interface {
  functions: {
    'boostToMax(uint256)': FunctionFragment;
    'canEject(address,uint256)': FunctionFragment;
    'depositByMonths(uint256,uint256,address)': FunctionFragment;
    'depositToken()': FunctionFragment;
    'eject(address[],uint256[])': FunctionFragment;
    'ejectBuffer()': FunctionFragment;
    'emergencyUnlockTriggered()': FunctionFragment;
    'getLocksOfLength(address)': FunctionFragment;
    'getRewardsMultiplier(uint32)': FunctionFragment;
    'getStakingData(address)': FunctionFragment;
    'initialize(address,address,uint32,uint32,uint256)': FunctionFragment;
    'locksOf(address,uint256)': FunctionFragment;
    'maxLockDuration()': FunctionFragment;
    'maxRatioArray(uint256)': FunctionFragment;
    'minLockAmount()': FunctionFragment;
    'minLockDuration()': FunctionFragment;
    'owner()': FunctionFragment;
    'renounceOwnership()': FunctionFragment;
    'rewardsToken()': FunctionFragment;
    'setEjectBuffer(uint256)': FunctionFragment;
    'setMinLockAmount(uint256)': FunctionFragment;
    'setWhitelisted(address,bool)': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
    'triggerEmergencyUnlock()': FunctionFragment;
    'whitelisted(address)': FunctionFragment;
    'withdraw(uint256)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'boostToMax'
      | 'canEject'
      | 'depositByMonths'
      | 'depositToken'
      | 'eject'
      | 'ejectBuffer'
      | 'emergencyUnlockTriggered'
      | 'getLocksOfLength'
      | 'getRewardsMultiplier'
      | 'getStakingData'
      | 'initialize'
      | 'locksOf'
      | 'maxLockDuration'
      | 'maxRatioArray'
      | 'minLockAmount'
      | 'minLockDuration'
      | 'owner'
      | 'renounceOwnership'
      | 'rewardsToken'
      | 'setEjectBuffer'
      | 'setMinLockAmount'
      | 'setWhitelisted'
      | 'transferOwnership'
      | 'triggerEmergencyUnlock'
      | 'whitelisted'
      | 'withdraw',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'boostToMax', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(
    functionFragment: 'canEject',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: 'depositByMonths',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(functionFragment: 'depositToken', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'eject',
    values: [PromiseOrValue<string>[], PromiseOrValue<BigNumberish>[]],
  ): string;
  encodeFunctionData(functionFragment: 'ejectBuffer', values?: undefined): string;
  encodeFunctionData(functionFragment: 'emergencyUnlockTriggered', values?: undefined): string;
  encodeFunctionData(functionFragment: 'getLocksOfLength', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'getRewardsMultiplier', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'getStakingData', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: 'initialize',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
    ],
  ): string;
  encodeFunctionData(
    functionFragment: 'locksOf',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(functionFragment: 'maxLockDuration', values?: undefined): string;
  encodeFunctionData(functionFragment: 'maxRatioArray', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'minLockAmount', values?: undefined): string;
  encodeFunctionData(functionFragment: 'minLockDuration', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'rewardsToken', values?: undefined): string;
  encodeFunctionData(functionFragment: 'setEjectBuffer', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'setMinLockAmount', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(
    functionFragment: 'setWhitelisted',
    values: [PromiseOrValue<string>, PromiseOrValue<boolean>],
  ): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'triggerEmergencyUnlock', values?: undefined): string;
  encodeFunctionData(functionFragment: 'whitelisted', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'withdraw', values: [PromiseOrValue<BigNumberish>]): string;

  decodeFunctionResult(functionFragment: 'boostToMax', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'canEject', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'depositByMonths', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'depositToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'eject', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'ejectBuffer', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'emergencyUnlockTriggered', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getLocksOfLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getRewardsMultiplier', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getStakingData', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'initialize', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'locksOf', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'maxLockDuration', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'maxRatioArray', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'minLockAmount', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'minLockDuration', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardsToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setEjectBuffer', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setMinLockAmount', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setWhitelisted', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'triggerEmergencyUnlock', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'whitelisted', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;

  events: {
    'BoostedToMax(uint256,uint256,uint256,address)': EventFragment;
    'Deposited(uint256,uint256,uint32,address)': EventFragment;
    'EjectBufferUpdated(uint256)': EventFragment;
    'Ejected(uint256,uint256,address)': EventFragment;
    'MinLockAmountChanged(uint256)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'WhitelistedChanged(address,bool)': EventFragment;
    'Withdrawn(uint256,uint256,address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'BoostedToMax'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Deposited'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'EjectBufferUpdated'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Ejected'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'MinLockAmountChanged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'WhitelistedChanged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdrawn'): EventFragment;
}

export interface BoostedToMaxEventObject {
  oldLockId: BigNumber;
  newLockId: BigNumber;
  amount: BigNumber;
  owner: string;
}
export type BoostedToMaxEvent = TypedEvent<[BigNumber, BigNumber, BigNumber, string], BoostedToMaxEventObject>;

export type BoostedToMaxEventFilter = TypedEventFilter<BoostedToMaxEvent>;

export interface DepositedEventObject {
  lockId: BigNumber;
  amount: BigNumber;
  lockDuration: number;
  owner: string;
}
export type DepositedEvent = TypedEvent<[BigNumber, BigNumber, number, string], DepositedEventObject>;

export type DepositedEventFilter = TypedEventFilter<DepositedEvent>;

export interface EjectBufferUpdatedEventObject {
  newEjectBuffer: BigNumber;
}
export type EjectBufferUpdatedEvent = TypedEvent<[BigNumber], EjectBufferUpdatedEventObject>;

export type EjectBufferUpdatedEventFilter = TypedEventFilter<EjectBufferUpdatedEvent>;

export interface EjectedEventObject {
  lockId: BigNumber;
  amount: BigNumber;
  owner: string;
}
export type EjectedEvent = TypedEvent<[BigNumber, BigNumber, string], EjectedEventObject>;

export type EjectedEventFilter = TypedEventFilter<EjectedEvent>;

export interface MinLockAmountChangedEventObject {
  newLockAmount: BigNumber;
}
export type MinLockAmountChangedEvent = TypedEvent<[BigNumber], MinLockAmountChangedEventObject>;

export type MinLockAmountChangedEventFilter = TypedEventFilter<MinLockAmountChangedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[string, string], OwnershipTransferredEventObject>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface WhitelistedChangedEventObject {
  user: string;
  whitelisted: boolean;
}
export type WhitelistedChangedEvent = TypedEvent<[string, boolean], WhitelistedChangedEventObject>;

export type WhitelistedChangedEventFilter = TypedEventFilter<WhitelistedChangedEvent>;

export interface WithdrawnEventObject {
  lockId: BigNumber;
  amount: BigNumber;
  owner: string;
}
export type WithdrawnEvent = TypedEvent<[BigNumber, BigNumber, string], WithdrawnEventObject>;

export type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;

export interface PieDaoVoteLockedDough extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PieDaoVoteLockedDoughInterface;

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
    boostToMax(
      lockId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    canEject(
      account: PromiseOrValue<string>,
      lockId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[boolean]>;

    depositByMonths(
      amount: PromiseOrValue<BigNumberish>,
      months: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    depositToken(overrides?: CallOverrides): Promise<[string]>;

    eject(
      lockAccounts: PromiseOrValue<string>[],
      lockIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    ejectBuffer(overrides?: CallOverrides): Promise<[BigNumber]>;

    emergencyUnlockTriggered(overrides?: CallOverrides): Promise<[boolean]>;

    getLocksOfLength(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    getRewardsMultiplier(
      duration: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { multiplier: BigNumber }>;

    getStakingData(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [SharesTimeLock.StakingDataStructOutput] & {
        data: SharesTimeLock.StakingDataStructOutput;
      }
    >;

    initialize(
      depositToken_: PromiseOrValue<string>,
      rewardsToken_: PromiseOrValue<string>,
      minLockDuration_: PromiseOrValue<BigNumberish>,
      maxLockDuration_: PromiseOrValue<BigNumberish>,
      minLockAmount_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    locksOf(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, number, number] & {
        amount: BigNumber;
        lockedAt: number;
        lockDuration: number;
      }
    >;

    maxLockDuration(overrides?: CallOverrides): Promise<[number]>;

    maxRatioArray(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;

    minLockAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    minLockDuration(overrides?: CallOverrides): Promise<[number]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    rewardsToken(overrides?: CallOverrides): Promise<[string]>;

    setEjectBuffer(
      buffer: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setMinLockAmount(
      minLockAmount_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setWhitelisted(
      user: PromiseOrValue<string>,
      isWhitelisted: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    triggerEmergencyUnlock(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    whitelisted(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;

    withdraw(
      lockId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;
  };

  boostToMax(
    lockId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  canEject(
    account: PromiseOrValue<string>,
    lockId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<boolean>;

  depositByMonths(
    amount: PromiseOrValue<BigNumberish>,
    months: PromiseOrValue<BigNumberish>,
    receiver: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  depositToken(overrides?: CallOverrides): Promise<string>;

  eject(
    lockAccounts: PromiseOrValue<string>[],
    lockIds: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  ejectBuffer(overrides?: CallOverrides): Promise<BigNumber>;

  emergencyUnlockTriggered(overrides?: CallOverrides): Promise<boolean>;

  getLocksOfLength(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  getRewardsMultiplier(duration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

  getStakingData(
    account: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<SharesTimeLock.StakingDataStructOutput>;

  initialize(
    depositToken_: PromiseOrValue<string>,
    rewardsToken_: PromiseOrValue<string>,
    minLockDuration_: PromiseOrValue<BigNumberish>,
    maxLockDuration_: PromiseOrValue<BigNumberish>,
    minLockAmount_: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  locksOf(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, number, number] & {
      amount: BigNumber;
      lockedAt: number;
      lockDuration: number;
    }
  >;

  maxLockDuration(overrides?: CallOverrides): Promise<number>;

  maxRatioArray(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

  minLockAmount(overrides?: CallOverrides): Promise<BigNumber>;

  minLockDuration(overrides?: CallOverrides): Promise<number>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  rewardsToken(overrides?: CallOverrides): Promise<string>;

  setEjectBuffer(
    buffer: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setMinLockAmount(
    minLockAmount_: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setWhitelisted(
    user: PromiseOrValue<string>,
    isWhitelisted: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  triggerEmergencyUnlock(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  whitelisted(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;

  withdraw(
    lockId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    boostToMax(lockId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;

    canEject(
      account: PromiseOrValue<string>,
      lockId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<boolean>;

    depositByMonths(
      amount: PromiseOrValue<BigNumberish>,
      months: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;

    depositToken(overrides?: CallOverrides): Promise<string>;

    eject(
      lockAccounts: PromiseOrValue<string>[],
      lockIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides,
    ): Promise<void>;

    ejectBuffer(overrides?: CallOverrides): Promise<BigNumber>;

    emergencyUnlockTriggered(overrides?: CallOverrides): Promise<boolean>;

    getLocksOfLength(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getRewardsMultiplier(duration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    getStakingData(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<SharesTimeLock.StakingDataStructOutput>;

    initialize(
      depositToken_: PromiseOrValue<string>,
      rewardsToken_: PromiseOrValue<string>,
      minLockDuration_: PromiseOrValue<BigNumberish>,
      maxLockDuration_: PromiseOrValue<BigNumberish>,
      minLockAmount_: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    locksOf(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, number, number] & {
        amount: BigNumber;
        lockedAt: number;
        lockDuration: number;
      }
    >;

    maxLockDuration(overrides?: CallOverrides): Promise<number>;

    maxRatioArray(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    minLockAmount(overrides?: CallOverrides): Promise<BigNumber>;

    minLockDuration(overrides?: CallOverrides): Promise<number>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardsToken(overrides?: CallOverrides): Promise<string>;

    setEjectBuffer(buffer: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;

    setMinLockAmount(minLockAmount_: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;

    setWhitelisted(
      user: PromiseOrValue<string>,
      isWhitelisted: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<void>;

    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    triggerEmergencyUnlock(overrides?: CallOverrides): Promise<void>;

    whitelisted(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;

    withdraw(lockId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    'BoostedToMax(uint256,uint256,uint256,address)'(
      oldLockId?: PromiseOrValue<BigNumberish> | null,
      newLockId?: PromiseOrValue<BigNumberish> | null,
      amount?: null,
      owner?: PromiseOrValue<string> | null,
    ): BoostedToMaxEventFilter;
    BoostedToMax(
      oldLockId?: PromiseOrValue<BigNumberish> | null,
      newLockId?: PromiseOrValue<BigNumberish> | null,
      amount?: null,
      owner?: PromiseOrValue<string> | null,
    ): BoostedToMaxEventFilter;

    'Deposited(uint256,uint256,uint32,address)'(
      lockId?: PromiseOrValue<BigNumberish> | null,
      amount?: null,
      lockDuration?: null,
      owner?: PromiseOrValue<string> | null,
    ): DepositedEventFilter;
    Deposited(
      lockId?: PromiseOrValue<BigNumberish> | null,
      amount?: null,
      lockDuration?: null,
      owner?: PromiseOrValue<string> | null,
    ): DepositedEventFilter;

    'EjectBufferUpdated(uint256)'(newEjectBuffer?: null): EjectBufferUpdatedEventFilter;
    EjectBufferUpdated(newEjectBuffer?: null): EjectBufferUpdatedEventFilter;

    'Ejected(uint256,uint256,address)'(
      lockId?: PromiseOrValue<BigNumberish> | null,
      amount?: null,
      owner?: PromiseOrValue<string> | null,
    ): EjectedEventFilter;
    Ejected(
      lockId?: PromiseOrValue<BigNumberish> | null,
      amount?: null,
      owner?: PromiseOrValue<string> | null,
    ): EjectedEventFilter;

    'MinLockAmountChanged(uint256)'(newLockAmount?: null): MinLockAmountChangedEventFilter;
    MinLockAmountChanged(newLockAmount?: null): MinLockAmountChangedEventFilter;

    'OwnershipTransferred(address,address)'(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter;

    'WhitelistedChanged(address,bool)'(
      user?: PromiseOrValue<string> | null,
      whitelisted?: PromiseOrValue<boolean> | null,
    ): WhitelistedChangedEventFilter;
    WhitelistedChanged(
      user?: PromiseOrValue<string> | null,
      whitelisted?: PromiseOrValue<boolean> | null,
    ): WhitelistedChangedEventFilter;

    'Withdrawn(uint256,uint256,address)'(
      lockId?: PromiseOrValue<BigNumberish> | null,
      amount?: null,
      owner?: PromiseOrValue<string> | null,
    ): WithdrawnEventFilter;
    Withdrawn(
      lockId?: PromiseOrValue<BigNumberish> | null,
      amount?: null,
      owner?: PromiseOrValue<string> | null,
    ): WithdrawnEventFilter;
  };

  estimateGas: {
    boostToMax(
      lockId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    canEject(
      account: PromiseOrValue<string>,
      lockId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    depositByMonths(
      amount: PromiseOrValue<BigNumberish>,
      months: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    depositToken(overrides?: CallOverrides): Promise<BigNumber>;

    eject(
      lockAccounts: PromiseOrValue<string>[],
      lockIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    ejectBuffer(overrides?: CallOverrides): Promise<BigNumber>;

    emergencyUnlockTriggered(overrides?: CallOverrides): Promise<BigNumber>;

    getLocksOfLength(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getRewardsMultiplier(duration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    getStakingData(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      depositToken_: PromiseOrValue<string>,
      rewardsToken_: PromiseOrValue<string>,
      minLockDuration_: PromiseOrValue<BigNumberish>,
      maxLockDuration_: PromiseOrValue<BigNumberish>,
      minLockAmount_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    locksOf(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    maxLockDuration(overrides?: CallOverrides): Promise<BigNumber>;

    maxRatioArray(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    minLockAmount(overrides?: CallOverrides): Promise<BigNumber>;

    minLockDuration(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    rewardsToken(overrides?: CallOverrides): Promise<BigNumber>;

    setEjectBuffer(
      buffer: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setMinLockAmount(
      minLockAmount_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setWhitelisted(
      user: PromiseOrValue<string>,
      isWhitelisted: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    triggerEmergencyUnlock(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    whitelisted(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(
      lockId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    boostToMax(
      lockId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    canEject(
      account: PromiseOrValue<string>,
      lockId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    depositByMonths(
      amount: PromiseOrValue<BigNumberish>,
      months: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    depositToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    eject(
      lockAccounts: PromiseOrValue<string>[],
      lockIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    ejectBuffer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    emergencyUnlockTriggered(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getLocksOfLength(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRewardsMultiplier(
      duration: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getStakingData(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      depositToken_: PromiseOrValue<string>,
      rewardsToken_: PromiseOrValue<string>,
      minLockDuration_: PromiseOrValue<BigNumberish>,
      maxLockDuration_: PromiseOrValue<BigNumberish>,
      minLockAmount_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    locksOf(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    maxLockDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxRatioArray(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    minLockAmount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    minLockDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    rewardsToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setEjectBuffer(
      buffer: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setMinLockAmount(
      minLockAmount_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setWhitelisted(
      user: PromiseOrValue<string>,
      isWhitelisted: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    triggerEmergencyUnlock(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    whitelisted(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      lockId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;
  };
}
