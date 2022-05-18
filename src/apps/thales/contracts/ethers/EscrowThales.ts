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

export interface EscrowThalesInterface extends utils.Interface {
  functions: {
    'NUM_PERIODS()': FunctionFragment;
    'ThalesStakingRewardsPool()': FunctionFragment;
    'acceptOwnership()': FunctionFragment;
    'addToEscrow(address,uint256)': FunctionFragment;
    'addTotalEscrowBalanceNotIncludedInStaking(uint256)': FunctionFragment;
    'airdropContract()': FunctionFragment;
    'claimable(address)': FunctionFragment;
    'currentVestingPeriod()': FunctionFragment;
    'enableTestMode()': FunctionFragment;
    'fixEscrowEntry(address)': FunctionFragment;
    'getStakedEscrowedBalanceForRewards(address)': FunctionFragment;
    'getStakerAmounts(address,uint256)': FunctionFragment;
    'getStakerPeriod(address,uint256)': FunctionFragment;
    'iStakingThales()': FunctionFragment;
    'initNonReentrant()': FunctionFragment;
    'initialize(address,address)': FunctionFragment;
    'lastPauseTime()': FunctionFragment;
    'lastPeriodAddedReward(address)': FunctionFragment;
    'nominateNewOwner(address)': FunctionFragment;
    'nominatedOwner()': FunctionFragment;
    'owner()': FunctionFragment;
    'paused()': FunctionFragment;
    'setAirdropContract(address)': FunctionFragment;
    'setOwner(address)': FunctionFragment;
    'setPaused(bool)': FunctionFragment;
    'setStakingThalesContract(address)': FunctionFragment;
    'setThalesStakingRewardsPool(address)': FunctionFragment;
    'subtractTotalEscrowBalanceNotIncludedInStaking(uint256)': FunctionFragment;
    'totalAccountEscrowedAmount(address)': FunctionFragment;
    'totalEscrowBalanceNotIncludedInStaking()': FunctionFragment;
    'totalEscrowedRewards()': FunctionFragment;
    'transferOwnershipAtInit(address)': FunctionFragment;
    'updateCurrentPeriod()': FunctionFragment;
    'vest(uint256)': FunctionFragment;
    'vestingEntries(address,uint256)': FunctionFragment;
    'vestingToken()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'NUM_PERIODS'
      | 'ThalesStakingRewardsPool'
      | 'acceptOwnership'
      | 'addToEscrow'
      | 'addTotalEscrowBalanceNotIncludedInStaking'
      | 'airdropContract'
      | 'claimable'
      | 'currentVestingPeriod'
      | 'enableTestMode'
      | 'fixEscrowEntry'
      | 'getStakedEscrowedBalanceForRewards'
      | 'getStakerAmounts'
      | 'getStakerPeriod'
      | 'iStakingThales'
      | 'initNonReentrant'
      | 'initialize'
      | 'lastPauseTime'
      | 'lastPeriodAddedReward'
      | 'nominateNewOwner'
      | 'nominatedOwner'
      | 'owner'
      | 'paused'
      | 'setAirdropContract'
      | 'setOwner'
      | 'setPaused'
      | 'setStakingThalesContract'
      | 'setThalesStakingRewardsPool'
      | 'subtractTotalEscrowBalanceNotIncludedInStaking'
      | 'totalAccountEscrowedAmount'
      | 'totalEscrowBalanceNotIncludedInStaking'
      | 'totalEscrowedRewards'
      | 'transferOwnershipAtInit'
      | 'updateCurrentPeriod'
      | 'vest'
      | 'vestingEntries'
      | 'vestingToken',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'NUM_PERIODS', values?: undefined): string;
  encodeFunctionData(functionFragment: 'ThalesStakingRewardsPool', values?: undefined): string;
  encodeFunctionData(functionFragment: 'acceptOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'addToEscrow', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'addTotalEscrowBalanceNotIncludedInStaking', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'airdropContract', values?: undefined): string;
  encodeFunctionData(functionFragment: 'claimable', values: [string]): string;
  encodeFunctionData(functionFragment: 'currentVestingPeriod', values?: undefined): string;
  encodeFunctionData(functionFragment: 'enableTestMode', values?: undefined): string;
  encodeFunctionData(functionFragment: 'fixEscrowEntry', values: [string]): string;
  encodeFunctionData(functionFragment: 'getStakedEscrowedBalanceForRewards', values: [string]): string;
  encodeFunctionData(functionFragment: 'getStakerAmounts', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'getStakerPeriod', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'iStakingThales', values?: undefined): string;
  encodeFunctionData(functionFragment: 'initNonReentrant', values?: undefined): string;
  encodeFunctionData(functionFragment: 'initialize', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'lastPauseTime', values?: undefined): string;
  encodeFunctionData(functionFragment: 'lastPeriodAddedReward', values: [string]): string;
  encodeFunctionData(functionFragment: 'nominateNewOwner', values: [string]): string;
  encodeFunctionData(functionFragment: 'nominatedOwner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'paused', values?: undefined): string;
  encodeFunctionData(functionFragment: 'setAirdropContract', values: [string]): string;
  encodeFunctionData(functionFragment: 'setOwner', values: [string]): string;
  encodeFunctionData(functionFragment: 'setPaused', values: [boolean]): string;
  encodeFunctionData(functionFragment: 'setStakingThalesContract', values: [string]): string;
  encodeFunctionData(functionFragment: 'setThalesStakingRewardsPool', values: [string]): string;
  encodeFunctionData(
    functionFragment: 'subtractTotalEscrowBalanceNotIncludedInStaking',
    values: [BigNumberish],
  ): string;
  encodeFunctionData(functionFragment: 'totalAccountEscrowedAmount', values: [string]): string;
  encodeFunctionData(functionFragment: 'totalEscrowBalanceNotIncludedInStaking', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalEscrowedRewards', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferOwnershipAtInit', values: [string]): string;
  encodeFunctionData(functionFragment: 'updateCurrentPeriod', values?: undefined): string;
  encodeFunctionData(functionFragment: 'vest', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'vestingEntries', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'vestingToken', values?: undefined): string;

  decodeFunctionResult(functionFragment: 'NUM_PERIODS', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'ThalesStakingRewardsPool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'acceptOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'addToEscrow', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'addTotalEscrowBalanceNotIncludedInStaking', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'airdropContract', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimable', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'currentVestingPeriod', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'enableTestMode', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'fixEscrowEntry', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getStakedEscrowedBalanceForRewards', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getStakerAmounts', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getStakerPeriod', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'iStakingThales', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'initNonReentrant', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'initialize', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lastPauseTime', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lastPeriodAddedReward', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'nominateNewOwner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'nominatedOwner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'paused', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setAirdropContract', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setOwner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setPaused', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setStakingThalesContract', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setThalesStakingRewardsPool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'subtractTotalEscrowBalanceNotIncludedInStaking', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalAccountEscrowedAmount', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalEscrowBalanceNotIncludedInStaking', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalEscrowedRewards', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnershipAtInit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updateCurrentPeriod', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'vest', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'vestingEntries', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'vestingToken', data: BytesLike): Result;

  events: {
    'AddedToEscrow(address,uint256)': EventFragment;
    'AirdropContractChanged(address)': EventFragment;
    'OwnerChanged(address,address)': EventFragment;
    'OwnerNominated(address)': EventFragment;
    'PauseChanged(bool)': EventFragment;
    'StakingThalesContractChanged(address)': EventFragment;
    'ThalesStakingRewardsPoolChanged(address)': EventFragment;
    'Vested(address,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'AddedToEscrow'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'AirdropContractChanged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnerChanged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnerNominated'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'PauseChanged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'StakingThalesContractChanged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'ThalesStakingRewardsPoolChanged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Vested'): EventFragment;
}

export interface AddedToEscrowEventObject {
  acount: string;
  amount: BigNumber;
}
export type AddedToEscrowEvent = TypedEvent<[string, BigNumber], AddedToEscrowEventObject>;

export type AddedToEscrowEventFilter = TypedEventFilter<AddedToEscrowEvent>;

export interface AirdropContractChangedEventObject {
  newAddress: string;
}
export type AirdropContractChangedEvent = TypedEvent<[string], AirdropContractChangedEventObject>;

export type AirdropContractChangedEventFilter = TypedEventFilter<AirdropContractChangedEvent>;

export interface OwnerChangedEventObject {
  oldOwner: string;
  newOwner: string;
}
export type OwnerChangedEvent = TypedEvent<[string, string], OwnerChangedEventObject>;

export type OwnerChangedEventFilter = TypedEventFilter<OwnerChangedEvent>;

export interface OwnerNominatedEventObject {
  newOwner: string;
}
export type OwnerNominatedEvent = TypedEvent<[string], OwnerNominatedEventObject>;

export type OwnerNominatedEventFilter = TypedEventFilter<OwnerNominatedEvent>;

export interface PauseChangedEventObject {
  isPaused: boolean;
}
export type PauseChangedEvent = TypedEvent<[boolean], PauseChangedEventObject>;

export type PauseChangedEventFilter = TypedEventFilter<PauseChangedEvent>;

export interface StakingThalesContractChangedEventObject {
  newAddress: string;
}
export type StakingThalesContractChangedEvent = TypedEvent<[string], StakingThalesContractChangedEventObject>;

export type StakingThalesContractChangedEventFilter = TypedEventFilter<StakingThalesContractChangedEvent>;

export interface ThalesStakingRewardsPoolChangedEventObject {
  thalesStakingRewardsPool: string;
}
export type ThalesStakingRewardsPoolChangedEvent = TypedEvent<[string], ThalesStakingRewardsPoolChangedEventObject>;

export type ThalesStakingRewardsPoolChangedEventFilter = TypedEventFilter<ThalesStakingRewardsPoolChangedEvent>;

export interface VestedEventObject {
  account: string;
  amount: BigNumber;
}
export type VestedEvent = TypedEvent<[string, BigNumber], VestedEventObject>;

export type VestedEventFilter = TypedEventFilter<VestedEvent>;

export interface EscrowThales extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: EscrowThalesInterface;

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
    NUM_PERIODS(overrides?: CallOverrides): Promise<[BigNumber]>;

    ThalesStakingRewardsPool(overrides?: CallOverrides): Promise<[string]>;

    acceptOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    addToEscrow(
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    addTotalEscrowBalanceNotIncludedInStaking(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    airdropContract(overrides?: CallOverrides): Promise<[string]>;

    claimable(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    currentVestingPeriod(overrides?: CallOverrides): Promise<[BigNumber]>;

    enableTestMode(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    fixEscrowEntry(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    getStakedEscrowedBalanceForRewards(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    getStakerAmounts(account: string, index: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    getStakerPeriod(account: string, index: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    iStakingThales(overrides?: CallOverrides): Promise<[string]>;

    initNonReentrant(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    initialize(
      _owner: string,
      _vestingToken: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    lastPauseTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    lastPeriodAddedReward(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    nominateNewOwner(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    nominatedOwner(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    setAirdropContract(
      AirdropContract: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setOwner(_owner: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    setPaused(
      _paused: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setStakingThalesContract(
      StakingThalesContract: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setThalesStakingRewardsPool(
      _thalesStakingRewardsPool: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    subtractTotalEscrowBalanceNotIncludedInStaking(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    totalAccountEscrowedAmount(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    totalEscrowBalanceNotIncludedInStaking(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalEscrowedRewards(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnershipAtInit(
      proxyAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    updateCurrentPeriod(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    vest(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    vestingEntries(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; vesting_period: BigNumber }>;

    vestingToken(overrides?: CallOverrides): Promise<[string]>;
  };

  NUM_PERIODS(overrides?: CallOverrides): Promise<BigNumber>;

  ThalesStakingRewardsPool(overrides?: CallOverrides): Promise<string>;

  acceptOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  addToEscrow(
    account: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  addTotalEscrowBalanceNotIncludedInStaking(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  airdropContract(overrides?: CallOverrides): Promise<string>;

  claimable(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  currentVestingPeriod(overrides?: CallOverrides): Promise<BigNumber>;

  enableTestMode(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  fixEscrowEntry(
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  getStakedEscrowedBalanceForRewards(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  getStakerAmounts(account: string, index: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  getStakerPeriod(account: string, index: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  iStakingThales(overrides?: CallOverrides): Promise<string>;

  initNonReentrant(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  initialize(
    _owner: string,
    _vestingToken: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  lastPauseTime(overrides?: CallOverrides): Promise<BigNumber>;

  lastPeriodAddedReward(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  nominateNewOwner(
    _owner: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  nominatedOwner(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  setAirdropContract(
    AirdropContract: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setOwner(_owner: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  setPaused(
    _paused: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setStakingThalesContract(
    StakingThalesContract: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setThalesStakingRewardsPool(
    _thalesStakingRewardsPool: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  subtractTotalEscrowBalanceNotIncludedInStaking(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  totalAccountEscrowedAmount(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  totalEscrowBalanceNotIncludedInStaking(overrides?: CallOverrides): Promise<BigNumber>;

  totalEscrowedRewards(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnershipAtInit(
    proxyAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  updateCurrentPeriod(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  vest(amount: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  vestingEntries(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; vesting_period: BigNumber }>;

  vestingToken(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    NUM_PERIODS(overrides?: CallOverrides): Promise<BigNumber>;

    ThalesStakingRewardsPool(overrides?: CallOverrides): Promise<string>;

    acceptOwnership(overrides?: CallOverrides): Promise<void>;

    addToEscrow(account: string, amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    addTotalEscrowBalanceNotIncludedInStaking(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    airdropContract(overrides?: CallOverrides): Promise<string>;

    claimable(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    currentVestingPeriod(overrides?: CallOverrides): Promise<BigNumber>;

    enableTestMode(overrides?: CallOverrides): Promise<void>;

    fixEscrowEntry(account: string, overrides?: CallOverrides): Promise<void>;

    getStakedEscrowedBalanceForRewards(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    getStakerAmounts(account: string, index: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    getStakerPeriod(account: string, index: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    iStakingThales(overrides?: CallOverrides): Promise<string>;

    initNonReentrant(overrides?: CallOverrides): Promise<void>;

    initialize(_owner: string, _vestingToken: string, overrides?: CallOverrides): Promise<void>;

    lastPauseTime(overrides?: CallOverrides): Promise<BigNumber>;

    lastPeriodAddedReward(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    nominateNewOwner(_owner: string, overrides?: CallOverrides): Promise<void>;

    nominatedOwner(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    setAirdropContract(AirdropContract: string, overrides?: CallOverrides): Promise<void>;

    setOwner(_owner: string, overrides?: CallOverrides): Promise<void>;

    setPaused(_paused: boolean, overrides?: CallOverrides): Promise<void>;

    setStakingThalesContract(StakingThalesContract: string, overrides?: CallOverrides): Promise<void>;

    setThalesStakingRewardsPool(_thalesStakingRewardsPool: string, overrides?: CallOverrides): Promise<void>;

    subtractTotalEscrowBalanceNotIncludedInStaking(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    totalAccountEscrowedAmount(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalEscrowBalanceNotIncludedInStaking(overrides?: CallOverrides): Promise<BigNumber>;

    totalEscrowedRewards(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnershipAtInit(proxyAddress: string, overrides?: CallOverrides): Promise<void>;

    updateCurrentPeriod(overrides?: CallOverrides): Promise<boolean>;

    vest(amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    vestingEntries(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; vesting_period: BigNumber }>;

    vestingToken(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    'AddedToEscrow(address,uint256)'(acount?: null, amount?: null): AddedToEscrowEventFilter;
    AddedToEscrow(acount?: null, amount?: null): AddedToEscrowEventFilter;

    'AirdropContractChanged(address)'(newAddress?: null): AirdropContractChangedEventFilter;
    AirdropContractChanged(newAddress?: null): AirdropContractChangedEventFilter;

    'OwnerChanged(address,address)'(oldOwner?: null, newOwner?: null): OwnerChangedEventFilter;
    OwnerChanged(oldOwner?: null, newOwner?: null): OwnerChangedEventFilter;

    'OwnerNominated(address)'(newOwner?: null): OwnerNominatedEventFilter;
    OwnerNominated(newOwner?: null): OwnerNominatedEventFilter;

    'PauseChanged(bool)'(isPaused?: null): PauseChangedEventFilter;
    PauseChanged(isPaused?: null): PauseChangedEventFilter;

    'StakingThalesContractChanged(address)'(newAddress?: null): StakingThalesContractChangedEventFilter;
    StakingThalesContractChanged(newAddress?: null): StakingThalesContractChangedEventFilter;

    'ThalesStakingRewardsPoolChanged(address)'(
      thalesStakingRewardsPool?: null,
    ): ThalesStakingRewardsPoolChangedEventFilter;
    ThalesStakingRewardsPoolChanged(thalesStakingRewardsPool?: null): ThalesStakingRewardsPoolChangedEventFilter;

    'Vested(address,uint256)'(account?: null, amount?: null): VestedEventFilter;
    Vested(account?: null, amount?: null): VestedEventFilter;
  };

  estimateGas: {
    NUM_PERIODS(overrides?: CallOverrides): Promise<BigNumber>;

    ThalesStakingRewardsPool(overrides?: CallOverrides): Promise<BigNumber>;

    acceptOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    addToEscrow(
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    addTotalEscrowBalanceNotIncludedInStaking(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    airdropContract(overrides?: CallOverrides): Promise<BigNumber>;

    claimable(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    currentVestingPeriod(overrides?: CallOverrides): Promise<BigNumber>;

    enableTestMode(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    fixEscrowEntry(account: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    getStakedEscrowedBalanceForRewards(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    getStakerAmounts(account: string, index: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    getStakerPeriod(account: string, index: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    iStakingThales(overrides?: CallOverrides): Promise<BigNumber>;

    initNonReentrant(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    initialize(
      _owner: string,
      _vestingToken: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    lastPauseTime(overrides?: CallOverrides): Promise<BigNumber>;

    lastPeriodAddedReward(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    nominateNewOwner(_owner: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    nominatedOwner(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    setAirdropContract(
      AirdropContract: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    setOwner(_owner: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    setPaused(_paused: boolean, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    setStakingThalesContract(
      StakingThalesContract: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    setThalesStakingRewardsPool(
      _thalesStakingRewardsPool: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    subtractTotalEscrowBalanceNotIncludedInStaking(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    totalAccountEscrowedAmount(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalEscrowBalanceNotIncludedInStaking(overrides?: CallOverrides): Promise<BigNumber>;

    totalEscrowedRewards(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnershipAtInit(
      proxyAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    updateCurrentPeriod(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    vest(amount: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    vestingEntries(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    vestingToken(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    NUM_PERIODS(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ThalesStakingRewardsPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    acceptOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    addToEscrow(
      account: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    addTotalEscrowBalanceNotIncludedInStaking(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    airdropContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimable(account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    currentVestingPeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    enableTestMode(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    fixEscrowEntry(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    getStakedEscrowedBalanceForRewards(account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getStakerAmounts(account: string, index: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getStakerPeriod(account: string, index: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    iStakingThales(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initNonReentrant(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    initialize(
      _owner: string,
      _vestingToken: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    lastPauseTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lastPeriodAddedReward(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nominateNewOwner(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    nominatedOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setAirdropContract(
      AirdropContract: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setOwner(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setPaused(
      _paused: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setStakingThalesContract(
      StakingThalesContract: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setThalesStakingRewardsPool(
      _thalesStakingRewardsPool: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    subtractTotalEscrowBalanceNotIncludedInStaking(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    totalAccountEscrowedAmount(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalEscrowBalanceNotIncludedInStaking(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalEscrowedRewards(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnershipAtInit(
      proxyAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    updateCurrentPeriod(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    vest(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    vestingEntries(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    vestingToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
