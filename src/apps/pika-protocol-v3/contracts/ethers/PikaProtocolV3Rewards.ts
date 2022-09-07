/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
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

export interface PikaProtocolV3RewardsInterface extends utils.Interface {
  functions: {
    'BASE()': FunctionFragment;
    'PRECISION()': FunctionFragment;
    'claimReward()': FunctionFragment;
    'cumulativeRewardPerTokenStored()': FunctionFragment;
    'getClaimableReward(address)': FunctionFragment;
    'gov()': FunctionFragment;
    'owner()': FunctionFragment;
    'paused()': FunctionFragment;
    'pikaPerp()': FunctionFragment;
    'reinvest()': FunctionFragment;
    'rewardToken()': FunctionFragment;
    'rewardTokenBase()': FunctionFragment;
    'setGov(address)': FunctionFragment;
    'setOwner(address)': FunctionFragment;
    'setPikaPerp(address)': FunctionFragment;
    'stakingToken()': FunctionFragment;
    'updateReward(address)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'BASE'
      | 'PRECISION'
      | 'claimReward'
      | 'cumulativeRewardPerTokenStored'
      | 'getClaimableReward'
      | 'gov'
      | 'owner'
      | 'paused'
      | 'pikaPerp'
      | 'reinvest'
      | 'rewardToken'
      | 'rewardTokenBase'
      | 'setGov'
      | 'setOwner'
      | 'setPikaPerp'
      | 'stakingToken'
      | 'updateReward',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'BASE', values?: undefined): string;
  encodeFunctionData(functionFragment: 'PRECISION', values?: undefined): string;
  encodeFunctionData(functionFragment: 'claimReward', values?: undefined): string;
  encodeFunctionData(functionFragment: 'cumulativeRewardPerTokenStored', values?: undefined): string;
  encodeFunctionData(functionFragment: 'getClaimableReward', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'gov', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'paused', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pikaPerp', values?: undefined): string;
  encodeFunctionData(functionFragment: 'reinvest', values?: undefined): string;
  encodeFunctionData(functionFragment: 'rewardToken', values?: undefined): string;
  encodeFunctionData(functionFragment: 'rewardTokenBase', values?: undefined): string;
  encodeFunctionData(functionFragment: 'setGov', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'setOwner', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'setPikaPerp', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'stakingToken', values?: undefined): string;
  encodeFunctionData(functionFragment: 'updateReward', values: [PromiseOrValue<string>]): string;

  decodeFunctionResult(functionFragment: 'BASE', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'PRECISION', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimReward', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'cumulativeRewardPerTokenStored', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getClaimableReward', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'gov', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'paused', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pikaPerp', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'reinvest', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardTokenBase', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setGov', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setOwner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setPikaPerp', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'stakingToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updateReward', data: BytesLike): Result;

  events: {
    'ClaimedReward(address,address,uint256)': EventFragment;
    'Paused(address)': EventFragment;
    'Reinvested(address,address,uint256)': EventFragment;
    'SetOwner(address)': EventFragment;
    'SetPikaPerp(address)': EventFragment;
    'Staked(address,uint256)': EventFragment;
    'Unpaused(address)': EventFragment;
    'Withdrawn(address,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'ClaimedReward'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Paused'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Reinvested'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'SetOwner'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'SetPikaPerp'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Staked'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Unpaused'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdrawn'): EventFragment;
}

export interface ClaimedRewardEventObject {
  user: string;
  rewardToken: string;
  amount: BigNumber;
}
export type ClaimedRewardEvent = TypedEvent<[string, string, BigNumber], ClaimedRewardEventObject>;

export type ClaimedRewardEventFilter = TypedEventFilter<ClaimedRewardEvent>;

export interface PausedEventObject {
  account: string;
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export interface ReinvestedEventObject {
  user: string;
  rewardToken: string;
  amount: BigNumber;
}
export type ReinvestedEvent = TypedEvent<[string, string, BigNumber], ReinvestedEventObject>;

export type ReinvestedEventFilter = TypedEventFilter<ReinvestedEvent>;

export interface SetOwnerEventObject {
  owner: string;
}
export type SetOwnerEvent = TypedEvent<[string], SetOwnerEventObject>;

export type SetOwnerEventFilter = TypedEventFilter<SetOwnerEvent>;

export interface SetPikaPerpEventObject {
  pikaPerp: string;
}
export type SetPikaPerpEvent = TypedEvent<[string], SetPikaPerpEventObject>;

export type SetPikaPerpEventFilter = TypedEventFilter<SetPikaPerpEvent>;

export interface StakedEventObject {
  user: string;
  amount: BigNumber;
}
export type StakedEvent = TypedEvent<[string, BigNumber], StakedEventObject>;

export type StakedEventFilter = TypedEventFilter<StakedEvent>;

export interface UnpausedEventObject {
  account: string;
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export interface WithdrawnEventObject {
  user: string;
  amount: BigNumber;
}
export type WithdrawnEvent = TypedEvent<[string, BigNumber], WithdrawnEventObject>;

export type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;

export interface PikaProtocolV3Rewards extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PikaProtocolV3RewardsInterface;

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
    BASE(overrides?: CallOverrides): Promise<[BigNumber]>;

    PRECISION(overrides?: CallOverrides): Promise<[BigNumber]>;

    claimReward(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    cumulativeRewardPerTokenStored(overrides?: CallOverrides): Promise<[BigNumber]>;

    getClaimableReward(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    gov(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    pikaPerp(overrides?: CallOverrides): Promise<[string]>;

    reinvest(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    rewardToken(overrides?: CallOverrides): Promise<[string]>;

    rewardTokenBase(overrides?: CallOverrides): Promise<[BigNumber]>;

    setGov(
      _gov: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setOwner(
      _owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setPikaPerp(
      _pikaPerp: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    stakingToken(overrides?: CallOverrides): Promise<[string]>;

    updateReward(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;
  };

  BASE(overrides?: CallOverrides): Promise<BigNumber>;

  PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

  claimReward(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  cumulativeRewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;

  getClaimableReward(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  gov(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  pikaPerp(overrides?: CallOverrides): Promise<string>;

  reinvest(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  rewardToken(overrides?: CallOverrides): Promise<string>;

  rewardTokenBase(overrides?: CallOverrides): Promise<BigNumber>;

  setGov(
    _gov: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setOwner(
    _owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setPikaPerp(
    _pikaPerp: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  stakingToken(overrides?: CallOverrides): Promise<string>;

  updateReward(
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    BASE(overrides?: CallOverrides): Promise<BigNumber>;

    PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    claimReward(overrides?: CallOverrides): Promise<BigNumber>;

    cumulativeRewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;

    getClaimableReward(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    gov(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    pikaPerp(overrides?: CallOverrides): Promise<string>;

    reinvest(overrides?: CallOverrides): Promise<BigNumber>;

    rewardToken(overrides?: CallOverrides): Promise<string>;

    rewardTokenBase(overrides?: CallOverrides): Promise<BigNumber>;

    setGov(_gov: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    setOwner(_owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    setPikaPerp(_pikaPerp: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    stakingToken(overrides?: CallOverrides): Promise<string>;

    updateReward(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    'ClaimedReward(address,address,uint256)'(user?: null, rewardToken?: null, amount?: null): ClaimedRewardEventFilter;
    ClaimedReward(user?: null, rewardToken?: null, amount?: null): ClaimedRewardEventFilter;

    'Paused(address)'(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    'Reinvested(address,address,uint256)'(user?: null, rewardToken?: null, amount?: null): ReinvestedEventFilter;
    Reinvested(user?: null, rewardToken?: null, amount?: null): ReinvestedEventFilter;

    'SetOwner(address)'(owner?: null): SetOwnerEventFilter;
    SetOwner(owner?: null): SetOwnerEventFilter;

    'SetPikaPerp(address)'(pikaPerp?: null): SetPikaPerpEventFilter;
    SetPikaPerp(pikaPerp?: null): SetPikaPerpEventFilter;

    'Staked(address,uint256)'(user?: PromiseOrValue<string> | null, amount?: null): StakedEventFilter;
    Staked(user?: PromiseOrValue<string> | null, amount?: null): StakedEventFilter;

    'Unpaused(address)'(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;

    'Withdrawn(address,uint256)'(user?: PromiseOrValue<string> | null, amount?: null): WithdrawnEventFilter;
    Withdrawn(user?: PromiseOrValue<string> | null, amount?: null): WithdrawnEventFilter;
  };

  estimateGas: {
    BASE(overrides?: CallOverrides): Promise<BigNumber>;

    PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    claimReward(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    cumulativeRewardPerTokenStored(overrides?: CallOverrides): Promise<BigNumber>;

    getClaimableReward(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    gov(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    pikaPerp(overrides?: CallOverrides): Promise<BigNumber>;

    reinvest(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    rewardToken(overrides?: CallOverrides): Promise<BigNumber>;

    rewardTokenBase(overrides?: CallOverrides): Promise<BigNumber>;

    setGov(_gov: PromiseOrValue<string>, overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    setOwner(
      _owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setPikaPerp(
      _pikaPerp: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    stakingToken(overrides?: CallOverrides): Promise<BigNumber>;

    updateReward(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    BASE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    PRECISION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimReward(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    cumulativeRewardPerTokenStored(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getClaimableReward(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    gov(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pikaPerp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    reinvest(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    rewardToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardTokenBase(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setGov(
      _gov: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setOwner(
      _owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setPikaPerp(
      _pikaPerp: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    stakingToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    updateReward(
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;
  };
}
