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

export interface PlutusEpochStakingInterface extends utils.Interface {
  functions: {
    'advanceEpoch()': FunctionFragment;
    'claimRewards(uint32)': FunctionFragment;
    'claimRewardsFor(uint32,address,address)': FunctionFragment;
    'closeStakingWindow()': FunctionFragment;
    'currentEpoch()': FunctionFragment;
    'currentEpochStartedAt()': FunctionFragment;
    'currentTotalStaked()': FunctionFragment;
    'epochCheckpoints(uint32)': FunctionFragment;
    'init()': FunctionFragment;
    'lockDuration()': FunctionFragment;
    'openStakingWindow()': FunctionFragment;
    'operator()': FunctionFragment;
    'owner()': FunctionFragment;
    'pause()': FunctionFragment;
    'paused()': FunctionFragment;
    'pls()': FunctionFragment;
    'renounceOwnership()': FunctionFragment;
    'setCurrentEpochStart(uint32)': FunctionFragment;
    'setOperator(address)': FunctionFragment;
    'setRewards(address)': FunctionFragment;
    'setWhitelist(address)': FunctionFragment;
    'stake(uint112)': FunctionFragment;
    'stakeFor(uint112,address)': FunctionFragment;
    'stakedCheckpoints(address,uint32)': FunctionFragment;
    'stakedDetails(address)': FunctionFragment;
    'stakingRewards()': FunctionFragment;
    'stakingWindowOpen()': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
    'unpause()': FunctionFragment;
    'unstake()': FunctionFragment;
    'unstakeFor(address,address)': FunctionFragment;
    'whitelist()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'advanceEpoch'
      | 'claimRewards'
      | 'claimRewardsFor'
      | 'closeStakingWindow'
      | 'currentEpoch'
      | 'currentEpochStartedAt'
      | 'currentTotalStaked'
      | 'epochCheckpoints'
      | 'init'
      | 'lockDuration'
      | 'openStakingWindow'
      | 'operator'
      | 'owner'
      | 'pause'
      | 'paused'
      | 'pls'
      | 'renounceOwnership'
      | 'setCurrentEpochStart'
      | 'setOperator'
      | 'setRewards'
      | 'setWhitelist'
      | 'stake'
      | 'stakeFor'
      | 'stakedCheckpoints'
      | 'stakedDetails'
      | 'stakingRewards'
      | 'stakingWindowOpen'
      | 'transferOwnership'
      | 'unpause'
      | 'unstake'
      | 'unstakeFor'
      | 'whitelist',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'advanceEpoch', values?: undefined): string;
  encodeFunctionData(functionFragment: 'claimRewards', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'claimRewardsFor', values: [BigNumberish, string, string]): string;
  encodeFunctionData(functionFragment: 'closeStakingWindow', values?: undefined): string;
  encodeFunctionData(functionFragment: 'currentEpoch', values?: undefined): string;
  encodeFunctionData(functionFragment: 'currentEpochStartedAt', values?: undefined): string;
  encodeFunctionData(functionFragment: 'currentTotalStaked', values?: undefined): string;
  encodeFunctionData(functionFragment: 'epochCheckpoints', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'init', values?: undefined): string;
  encodeFunctionData(functionFragment: 'lockDuration', values?: undefined): string;
  encodeFunctionData(functionFragment: 'openStakingWindow', values?: undefined): string;
  encodeFunctionData(functionFragment: 'operator', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pause', values?: undefined): string;
  encodeFunctionData(functionFragment: 'paused', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pls', values?: undefined): string;
  encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'setCurrentEpochStart', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'setOperator', values: [string]): string;
  encodeFunctionData(functionFragment: 'setRewards', values: [string]): string;
  encodeFunctionData(functionFragment: 'setWhitelist', values: [string]): string;
  encodeFunctionData(functionFragment: 'stake', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'stakeFor', values: [BigNumberish, string]): string;
  encodeFunctionData(functionFragment: 'stakedCheckpoints', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'stakedDetails', values: [string]): string;
  encodeFunctionData(functionFragment: 'stakingRewards', values?: undefined): string;
  encodeFunctionData(functionFragment: 'stakingWindowOpen', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [string]): string;
  encodeFunctionData(functionFragment: 'unpause', values?: undefined): string;
  encodeFunctionData(functionFragment: 'unstake', values?: undefined): string;
  encodeFunctionData(functionFragment: 'unstakeFor', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'whitelist', values?: undefined): string;

  decodeFunctionResult(functionFragment: 'advanceEpoch', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimRewards', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimRewardsFor', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'closeStakingWindow', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'currentEpoch', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'currentEpochStartedAt', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'currentTotalStaked', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'epochCheckpoints', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'init', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lockDuration', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'openStakingWindow', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'operator', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pause', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'paused', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pls', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setCurrentEpochStart', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setOperator', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setRewards', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setWhitelist', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'stake', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'stakeFor', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'stakedCheckpoints', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'stakedDetails', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'stakingRewards', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'stakingWindowOpen', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'unpause', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'unstake', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'unstakeFor', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'whitelist', data: BytesLike): Result;

  events: {
    'AdvanceEpoch()': EventFragment;
    'ClaimedRewards(address,uint32)': EventFragment;
    'OperatorChange(address,address)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'Paused(address)': EventFragment;
    'Staked(address,uint112,uint32)': EventFragment;
    'Unpaused(address)': EventFragment;
    'Unstaked(address,uint112,uint32)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'AdvanceEpoch'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'ClaimedRewards'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OperatorChange'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Paused'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Staked'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Unpaused'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Unstaked'): EventFragment;
}

export interface AdvanceEpochEventObject {}
export type AdvanceEpochEvent = TypedEvent<[], AdvanceEpochEventObject>;

export type AdvanceEpochEventFilter = TypedEventFilter<AdvanceEpochEvent>;

export interface ClaimedRewardsEventObject {
  _user: string;
  _epoch: number;
}
export type ClaimedRewardsEvent = TypedEvent<[string, number], ClaimedRewardsEventObject>;

export type ClaimedRewardsEventFilter = TypedEventFilter<ClaimedRewardsEvent>;

export interface OperatorChangeEventObject {
  _to: string;
  _from: string;
}
export type OperatorChangeEvent = TypedEvent<[string, string], OperatorChangeEventObject>;

export type OperatorChangeEventFilter = TypedEventFilter<OperatorChangeEvent>;

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

export interface StakedEventObject {
  _from: string;
  _amt: BigNumber;
  _epoch: number;
}
export type StakedEvent = TypedEvent<[string, BigNumber, number], StakedEventObject>;

export type StakedEventFilter = TypedEventFilter<StakedEvent>;

export interface UnpausedEventObject {
  account: string;
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export interface UnstakedEventObject {
  _from: string;
  _amt: BigNumber;
  _epoch: number;
}
export type UnstakedEvent = TypedEvent<[string, BigNumber, number], UnstakedEventObject>;

export type UnstakedEventFilter = TypedEventFilter<UnstakedEvent>;

export interface PlutusEpochStaking extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PlutusEpochStakingInterface;

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
    advanceEpoch(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    claimRewards(
      _epoch: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    claimRewardsFor(
      _epoch: BigNumberish,
      _user: string,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    closeStakingWindow(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    currentEpoch(overrides?: CallOverrides): Promise<[number]>;

    currentEpochStartedAt(overrides?: CallOverrides): Promise<[number]>;

    currentTotalStaked(overrides?: CallOverrides): Promise<[BigNumber]>;

    epochCheckpoints(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [number, number, BigNumber] & {
        startedAt: number;
        endedAt: number;
        totalStaked: BigNumber;
      }
    >;

    init(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    lockDuration(overrides?: CallOverrides): Promise<[number]>;

    openStakingWindow(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    operator(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    pls(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    setCurrentEpochStart(
      _timestamp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setOperator(
      _operator: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setRewards(
      _stakingRewards: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setWhitelist(
      _whitelist: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    stake(
      _amt: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    stakeFor(
      _amt: BigNumberish,
      _user: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    stakedCheckpoints(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    stakedDetails(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, number] & { amount: BigNumber; lastCheckpoint: number }>;

    stakingRewards(overrides?: CallOverrides): Promise<[string]>;

    stakingWindowOpen(overrides?: CallOverrides): Promise<[boolean]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    unpause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    unstake(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    unstakeFor(
      _user: string,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    whitelist(overrides?: CallOverrides): Promise<[string]>;
  };

  advanceEpoch(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  claimRewards(
    _epoch: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  claimRewardsFor(
    _epoch: BigNumberish,
    _user: string,
    _to: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  closeStakingWindow(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  currentEpoch(overrides?: CallOverrides): Promise<number>;

  currentEpochStartedAt(overrides?: CallOverrides): Promise<number>;

  currentTotalStaked(overrides?: CallOverrides): Promise<BigNumber>;

  epochCheckpoints(
    arg0: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<
    [number, number, BigNumber] & {
      startedAt: number;
      endedAt: number;
      totalStaked: BigNumber;
    }
  >;

  init(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  lockDuration(overrides?: CallOverrides): Promise<number>;

  openStakingWindow(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  operator(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  pause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  pls(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  setCurrentEpochStart(
    _timestamp: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setOperator(
    _operator: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setRewards(
    _stakingRewards: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setWhitelist(
    _whitelist: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  stake(_amt: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  stakeFor(
    _amt: BigNumberish,
    _user: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  stakedCheckpoints(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  stakedDetails(
    arg0: string,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, number] & { amount: BigNumber; lastCheckpoint: number }>;

  stakingRewards(overrides?: CallOverrides): Promise<string>;

  stakingWindowOpen(overrides?: CallOverrides): Promise<boolean>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  unpause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  unstake(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  unstakeFor(
    _user: string,
    _to: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  whitelist(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    advanceEpoch(overrides?: CallOverrides): Promise<void>;

    claimRewards(_epoch: BigNumberish, overrides?: CallOverrides): Promise<void>;

    claimRewardsFor(_epoch: BigNumberish, _user: string, _to: string, overrides?: CallOverrides): Promise<void>;

    closeStakingWindow(overrides?: CallOverrides): Promise<void>;

    currentEpoch(overrides?: CallOverrides): Promise<number>;

    currentEpochStartedAt(overrides?: CallOverrides): Promise<number>;

    currentTotalStaked(overrides?: CallOverrides): Promise<BigNumber>;

    epochCheckpoints(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [number, number, BigNumber] & {
        startedAt: number;
        endedAt: number;
        totalStaked: BigNumber;
      }
    >;

    init(overrides?: CallOverrides): Promise<void>;

    lockDuration(overrides?: CallOverrides): Promise<number>;

    openStakingWindow(overrides?: CallOverrides): Promise<void>;

    operator(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    pls(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setCurrentEpochStart(_timestamp: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setOperator(_operator: string, overrides?: CallOverrides): Promise<void>;

    setRewards(_stakingRewards: string, overrides?: CallOverrides): Promise<void>;

    setWhitelist(_whitelist: string, overrides?: CallOverrides): Promise<void>;

    stake(_amt: BigNumberish, overrides?: CallOverrides): Promise<void>;

    stakeFor(_amt: BigNumberish, _user: string, overrides?: CallOverrides): Promise<void>;

    stakedCheckpoints(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    stakedDetails(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, number] & { amount: BigNumber; lastCheckpoint: number }>;

    stakingRewards(overrides?: CallOverrides): Promise<string>;

    stakingWindowOpen(overrides?: CallOverrides): Promise<boolean>;

    transferOwnership(newOwner: string, overrides?: CallOverrides): Promise<void>;

    unpause(overrides?: CallOverrides): Promise<void>;

    unstake(overrides?: CallOverrides): Promise<void>;

    unstakeFor(_user: string, _to: string, overrides?: CallOverrides): Promise<void>;

    whitelist(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    'AdvanceEpoch()'(): AdvanceEpochEventFilter;
    AdvanceEpoch(): AdvanceEpochEventFilter;

    'ClaimedRewards(address,uint32)'(_user?: string | null, _epoch?: null): ClaimedRewardsEventFilter;
    ClaimedRewards(_user?: string | null, _epoch?: null): ClaimedRewardsEventFilter;

    'OperatorChange(address,address)'(_to?: string | null, _from?: string | null): OperatorChangeEventFilter;
    OperatorChange(_to?: string | null, _from?: string | null): OperatorChangeEventFilter;

    'OwnershipTransferred(address,address)'(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): OwnershipTransferredEventFilter;

    'Paused(address)'(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    'Staked(address,uint112,uint32)'(_from?: string | null, _amt?: null, _epoch?: null): StakedEventFilter;
    Staked(_from?: string | null, _amt?: null, _epoch?: null): StakedEventFilter;

    'Unpaused(address)'(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;

    'Unstaked(address,uint112,uint32)'(_from?: string | null, _amt?: null, _epoch?: null): UnstakedEventFilter;
    Unstaked(_from?: string | null, _amt?: null, _epoch?: null): UnstakedEventFilter;
  };

  estimateGas: {
    advanceEpoch(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    claimRewards(_epoch: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    claimRewardsFor(
      _epoch: BigNumberish,
      _user: string,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    closeStakingWindow(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    currentEpoch(overrides?: CallOverrides): Promise<BigNumber>;

    currentEpochStartedAt(overrides?: CallOverrides): Promise<BigNumber>;

    currentTotalStaked(overrides?: CallOverrides): Promise<BigNumber>;

    epochCheckpoints(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    init(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    lockDuration(overrides?: CallOverrides): Promise<BigNumber>;

    openStakingWindow(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    operator(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    pls(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    setCurrentEpochStart(
      _timestamp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    setOperator(_operator: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    setRewards(
      _stakingRewards: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    setWhitelist(_whitelist: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    stake(_amt: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    stakeFor(
      _amt: BigNumberish,
      _user: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    stakedCheckpoints(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    stakedDetails(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    stakingRewards(overrides?: CallOverrides): Promise<BigNumber>;

    stakingWindowOpen(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    unpause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    unstake(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    unstakeFor(
      _user: string,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    whitelist(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    advanceEpoch(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    claimRewards(
      _epoch: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    claimRewardsFor(
      _epoch: BigNumberish,
      _user: string,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    closeStakingWindow(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    currentEpoch(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    currentEpochStartedAt(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    currentTotalStaked(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    epochCheckpoints(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    init(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    lockDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    openStakingWindow(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    operator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pls(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    setCurrentEpochStart(
      _timestamp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setOperator(
      _operator: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setRewards(
      _stakingRewards: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setWhitelist(
      _whitelist: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    stake(
      _amt: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    stakeFor(
      _amt: BigNumberish,
      _user: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    stakedCheckpoints(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    stakedDetails(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    stakingRewards(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    stakingWindowOpen(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    unpause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    unstake(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    unstakeFor(
      _user: string,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    whitelist(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
