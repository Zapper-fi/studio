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

export interface CamelotMasterInterface extends utils.Interface {
  functions: {
    'activePoolsLength()': FunctionFragment;
    'add(address,uint256,bool)': FunctionFragment;
    'claimRewards()': FunctionFragment;
    'emergencyUnlock()': FunctionFragment;
    'emissionRate()': FunctionFragment;
    'getActivePoolAddressByIndex(uint256)': FunctionFragment;
    'getPoolAddressByIndex(uint256)': FunctionFragment;
    'getPoolInfo(address)': FunctionFragment;
    'grailToken()': FunctionFragment;
    'massUpdatePools()': FunctionFragment;
    'owner()': FunctionFragment;
    'poolsLength()': FunctionFragment;
    'renounceOwnership()': FunctionFragment;
    'set(address,uint256,bool)': FunctionFragment;
    'setEmergencyUnlock(bool)': FunctionFragment;
    'setYieldBooster(address)': FunctionFragment;
    'startTime()': FunctionFragment;
    'totalAllocPoint()': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
    'updatePool(address)': FunctionFragment;
    'yieldBooster()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'activePoolsLength'
      | 'add'
      | 'claimRewards'
      | 'emergencyUnlock'
      | 'emissionRate'
      | 'getActivePoolAddressByIndex'
      | 'getPoolAddressByIndex'
      | 'getPoolInfo'
      | 'grailToken'
      | 'massUpdatePools'
      | 'owner'
      | 'poolsLength'
      | 'renounceOwnership'
      | 'set'
      | 'setEmergencyUnlock'
      | 'setYieldBooster'
      | 'startTime'
      | 'totalAllocPoint'
      | 'transferOwnership'
      | 'updatePool'
      | 'yieldBooster',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'activePoolsLength', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'add',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>, PromiseOrValue<boolean>],
  ): string;
  encodeFunctionData(functionFragment: 'claimRewards', values?: undefined): string;
  encodeFunctionData(functionFragment: 'emergencyUnlock', values?: undefined): string;
  encodeFunctionData(functionFragment: 'emissionRate', values?: undefined): string;
  encodeFunctionData(functionFragment: 'getActivePoolAddressByIndex', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'getPoolAddressByIndex', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'getPoolInfo', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'grailToken', values?: undefined): string;
  encodeFunctionData(functionFragment: 'massUpdatePools', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'poolsLength', values?: undefined): string;
  encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'set',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>, PromiseOrValue<boolean>],
  ): string;
  encodeFunctionData(functionFragment: 'setEmergencyUnlock', values: [PromiseOrValue<boolean>]): string;
  encodeFunctionData(functionFragment: 'setYieldBooster', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'startTime', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalAllocPoint', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'updatePool', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'yieldBooster', values?: undefined): string;

  decodeFunctionResult(functionFragment: 'activePoolsLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'add', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimRewards', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'emergencyUnlock', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'emissionRate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getActivePoolAddressByIndex', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getPoolAddressByIndex', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getPoolInfo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'grailToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'massUpdatePools', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolsLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'set', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setEmergencyUnlock', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setYieldBooster', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'startTime', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalAllocPoint', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updatePool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'yieldBooster', data: BytesLike): Result;

  events: {
    'ClaimRewards(address,uint256)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'PoolAdded(address,uint256)': EventFragment;
    'PoolSet(address,uint256)': EventFragment;
    'PoolUpdated(address,uint256,uint256)': EventFragment;
    'SetEmergencyUnlock(bool)': EventFragment;
    'SetYieldBooster(address,address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'ClaimRewards'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'PoolAdded'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'PoolSet'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'PoolUpdated'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'SetEmergencyUnlock'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'SetYieldBooster'): EventFragment;
}

export interface ClaimRewardsEventObject {
  poolAddress: string;
  amount: BigNumber;
}
export type ClaimRewardsEvent = TypedEvent<[string, BigNumber], ClaimRewardsEventObject>;

export type ClaimRewardsEventFilter = TypedEventFilter<ClaimRewardsEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[string, string], OwnershipTransferredEventObject>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface PoolAddedEventObject {
  poolAddress: string;
  allocPoint: BigNumber;
}
export type PoolAddedEvent = TypedEvent<[string, BigNumber], PoolAddedEventObject>;

export type PoolAddedEventFilter = TypedEventFilter<PoolAddedEvent>;

export interface PoolSetEventObject {
  poolAddress: string;
  allocPoint: BigNumber;
}
export type PoolSetEvent = TypedEvent<[string, BigNumber], PoolSetEventObject>;

export type PoolSetEventFilter = TypedEventFilter<PoolSetEvent>;

export interface PoolUpdatedEventObject {
  poolAddress: string;
  reserve: BigNumber;
  lastRewardTime: BigNumber;
}
export type PoolUpdatedEvent = TypedEvent<[string, BigNumber, BigNumber], PoolUpdatedEventObject>;

export type PoolUpdatedEventFilter = TypedEventFilter<PoolUpdatedEvent>;

export interface SetEmergencyUnlockEventObject {
  emergencyUnlock: boolean;
}
export type SetEmergencyUnlockEvent = TypedEvent<[boolean], SetEmergencyUnlockEventObject>;

export type SetEmergencyUnlockEventFilter = TypedEventFilter<SetEmergencyUnlockEvent>;

export interface SetYieldBoosterEventObject {
  previousYieldBooster: string;
  newYieldBooster: string;
}
export type SetYieldBoosterEvent = TypedEvent<[string, string], SetYieldBoosterEventObject>;

export type SetYieldBoosterEventFilter = TypedEventFilter<SetYieldBoosterEvent>;

export interface CamelotMaster extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CamelotMasterInterface;

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
    activePoolsLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    add(
      nftPool: PromiseOrValue<string>,
      allocPoint: PromiseOrValue<BigNumberish>,
      withUpdate: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    claimRewards(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    emergencyUnlock(overrides?: CallOverrides): Promise<[boolean]>;

    emissionRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    getActivePoolAddressByIndex(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;

    getPoolAddressByIndex(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;

    getPoolInfo(
      poolAddress_: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, BigNumber] & {
        poolAddress: string;
        allocPoint: BigNumber;
        lastRewardTime: BigNumber;
        reserve: BigNumber;
        poolEmissionRate: BigNumber;
      }
    >;

    grailToken(overrides?: CallOverrides): Promise<[string]>;

    massUpdatePools(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    poolsLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    set(
      poolAddress: PromiseOrValue<string>,
      allocPoint: PromiseOrValue<BigNumberish>,
      withUpdate: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setEmergencyUnlock(
      emergencyUnlock_: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setYieldBooster(
      yieldBooster_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    startTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalAllocPoint(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    updatePool(
      nftPool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    yieldBooster(overrides?: CallOverrides): Promise<[string]>;
  };

  activePoolsLength(overrides?: CallOverrides): Promise<BigNumber>;

  add(
    nftPool: PromiseOrValue<string>,
    allocPoint: PromiseOrValue<BigNumberish>,
    withUpdate: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  claimRewards(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  emergencyUnlock(overrides?: CallOverrides): Promise<boolean>;

  emissionRate(overrides?: CallOverrides): Promise<BigNumber>;

  getActivePoolAddressByIndex(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;

  getPoolAddressByIndex(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;

  getPoolInfo(
    poolAddress_: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<
    [string, BigNumber, BigNumber, BigNumber, BigNumber] & {
      poolAddress: string;
      allocPoint: BigNumber;
      lastRewardTime: BigNumber;
      reserve: BigNumber;
      poolEmissionRate: BigNumber;
    }
  >;

  grailToken(overrides?: CallOverrides): Promise<string>;

  massUpdatePools(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  poolsLength(overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  set(
    poolAddress: PromiseOrValue<string>,
    allocPoint: PromiseOrValue<BigNumberish>,
    withUpdate: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setEmergencyUnlock(
    emergencyUnlock_: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setYieldBooster(
    yieldBooster_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  startTime(overrides?: CallOverrides): Promise<BigNumber>;

  totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  updatePool(
    nftPool: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  yieldBooster(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    activePoolsLength(overrides?: CallOverrides): Promise<BigNumber>;

    add(
      nftPool: PromiseOrValue<string>,
      allocPoint: PromiseOrValue<BigNumberish>,
      withUpdate: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<void>;

    claimRewards(overrides?: CallOverrides): Promise<BigNumber>;

    emergencyUnlock(overrides?: CallOverrides): Promise<boolean>;

    emissionRate(overrides?: CallOverrides): Promise<BigNumber>;

    getActivePoolAddressByIndex(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;

    getPoolAddressByIndex(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;

    getPoolInfo(
      poolAddress_: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, BigNumber] & {
        poolAddress: string;
        allocPoint: BigNumber;
        lastRewardTime: BigNumber;
        reserve: BigNumber;
        poolEmissionRate: BigNumber;
      }
    >;

    grailToken(overrides?: CallOverrides): Promise<string>;

    massUpdatePools(overrides?: CallOverrides): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    poolsLength(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    set(
      poolAddress: PromiseOrValue<string>,
      allocPoint: PromiseOrValue<BigNumberish>,
      withUpdate: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<void>;

    setEmergencyUnlock(emergencyUnlock_: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;

    setYieldBooster(yieldBooster_: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    startTime(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    updatePool(nftPool: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    yieldBooster(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    'ClaimRewards(address,uint256)'(
      poolAddress?: PromiseOrValue<string> | null,
      amount?: null,
    ): ClaimRewardsEventFilter;
    ClaimRewards(poolAddress?: PromiseOrValue<string> | null, amount?: null): ClaimRewardsEventFilter;

    'OwnershipTransferred(address,address)'(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter;

    'PoolAdded(address,uint256)'(poolAddress?: PromiseOrValue<string> | null, allocPoint?: null): PoolAddedEventFilter;
    PoolAdded(poolAddress?: PromiseOrValue<string> | null, allocPoint?: null): PoolAddedEventFilter;

    'PoolSet(address,uint256)'(poolAddress?: PromiseOrValue<string> | null, allocPoint?: null): PoolSetEventFilter;
    PoolSet(poolAddress?: PromiseOrValue<string> | null, allocPoint?: null): PoolSetEventFilter;

    'PoolUpdated(address,uint256,uint256)'(
      poolAddress?: PromiseOrValue<string> | null,
      reserve?: null,
      lastRewardTime?: null,
    ): PoolUpdatedEventFilter;
    PoolUpdated(
      poolAddress?: PromiseOrValue<string> | null,
      reserve?: null,
      lastRewardTime?: null,
    ): PoolUpdatedEventFilter;

    'SetEmergencyUnlock(bool)'(emergencyUnlock?: null): SetEmergencyUnlockEventFilter;
    SetEmergencyUnlock(emergencyUnlock?: null): SetEmergencyUnlockEventFilter;

    'SetYieldBooster(address,address)'(previousYieldBooster?: null, newYieldBooster?: null): SetYieldBoosterEventFilter;
    SetYieldBooster(previousYieldBooster?: null, newYieldBooster?: null): SetYieldBoosterEventFilter;
  };

  estimateGas: {
    activePoolsLength(overrides?: CallOverrides): Promise<BigNumber>;

    add(
      nftPool: PromiseOrValue<string>,
      allocPoint: PromiseOrValue<BigNumberish>,
      withUpdate: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    claimRewards(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    emergencyUnlock(overrides?: CallOverrides): Promise<BigNumber>;

    emissionRate(overrides?: CallOverrides): Promise<BigNumber>;

    getActivePoolAddressByIndex(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    getPoolAddressByIndex(index: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    getPoolInfo(poolAddress_: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    grailToken(overrides?: CallOverrides): Promise<BigNumber>;

    massUpdatePools(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    poolsLength(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    set(
      poolAddress: PromiseOrValue<string>,
      allocPoint: PromiseOrValue<BigNumberish>,
      withUpdate: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setEmergencyUnlock(
      emergencyUnlock_: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setYieldBooster(
      yieldBooster_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    startTime(overrides?: CallOverrides): Promise<BigNumber>;

    totalAllocPoint(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    updatePool(
      nftPool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    yieldBooster(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    activePoolsLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    add(
      nftPool: PromiseOrValue<string>,
      allocPoint: PromiseOrValue<BigNumberish>,
      withUpdate: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    claimRewards(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    emergencyUnlock(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    emissionRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getActivePoolAddressByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getPoolAddressByIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getPoolInfo(poolAddress_: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    grailToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    massUpdatePools(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolsLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    set(
      poolAddress: PromiseOrValue<string>,
      allocPoint: PromiseOrValue<BigNumberish>,
      withUpdate: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setEmergencyUnlock(
      emergencyUnlock_: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setYieldBooster(
      yieldBooster_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    startTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalAllocPoint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    updatePool(
      nftPool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    yieldBooster(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
