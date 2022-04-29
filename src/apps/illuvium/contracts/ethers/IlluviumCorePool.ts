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

export declare namespace IPool {
  export type DepositStruct = {
    tokenAmount: BigNumberish;
    weight: BigNumberish;
    lockedFrom: BigNumberish;
    lockedUntil: BigNumberish;
    isYield: boolean;
  };

  export type DepositStructOutput = [BigNumber, BigNumber, BigNumber, BigNumber, boolean] & {
    tokenAmount: BigNumber;
    weight: BigNumber;
    lockedFrom: BigNumber;
    lockedUntil: BigNumber;
    isYield: boolean;
  };
}

export interface IlluviumCorePoolInterface extends utils.Interface {
  functions: {
    'balanceOf(address)': FunctionFragment;
    'blockNumber()': FunctionFragment;
    'factory()': FunctionFragment;
    'getDeposit(address,uint256)': FunctionFragment;
    'getDepositsLength(address)': FunctionFragment;
    'ilv()': FunctionFragment;
    'isFlashPool()': FunctionFragment;
    'lastYieldDistribution()': FunctionFragment;
    'now256()': FunctionFragment;
    'pendingVaultRewards(address)': FunctionFragment;
    'pendingYieldRewards(address)': FunctionFragment;
    'poolToken()': FunctionFragment;
    'poolTokenReserve()': FunctionFragment;
    'processRewards(bool)': FunctionFragment;
    'receiveVaultRewards(uint256)': FunctionFragment;
    'rewardToWeight(uint256,uint256)': FunctionFragment;
    'setVault(address)': FunctionFragment;
    'setWeight(uint32)': FunctionFragment;
    'silv()': FunctionFragment;
    'stake(uint256,uint64,bool)': FunctionFragment;
    'stakeAsPool(address,uint256)': FunctionFragment;
    'sync()': FunctionFragment;
    'unstake(uint256,uint256,bool)': FunctionFragment;
    'updateStakeLock(uint256,uint64,bool)': FunctionFragment;
    'users(address)': FunctionFragment;
    'usersLockingWeight()': FunctionFragment;
    'vault()': FunctionFragment;
    'vaultRewardsPerWeight()': FunctionFragment;
    'weight()': FunctionFragment;
    'weightToReward(uint256,uint256)': FunctionFragment;
    'yieldRewardsPerWeight()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'balanceOf'
      | 'blockNumber'
      | 'factory'
      | 'getDeposit'
      | 'getDepositsLength'
      | 'ilv'
      | 'isFlashPool'
      | 'lastYieldDistribution'
      | 'now256'
      | 'pendingVaultRewards'
      | 'pendingYieldRewards'
      | 'poolToken'
      | 'poolTokenReserve'
      | 'processRewards'
      | 'receiveVaultRewards'
      | 'rewardToWeight'
      | 'setVault'
      | 'setWeight'
      | 'silv'
      | 'stake'
      | 'stakeAsPool'
      | 'sync'
      | 'unstake'
      | 'updateStakeLock'
      | 'users'
      | 'usersLockingWeight'
      | 'vault'
      | 'vaultRewardsPerWeight'
      | 'weight'
      | 'weightToReward'
      | 'yieldRewardsPerWeight',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'balanceOf', values: [string]): string;
  encodeFunctionData(functionFragment: 'blockNumber', values?: undefined): string;
  encodeFunctionData(functionFragment: 'factory', values?: undefined): string;
  encodeFunctionData(functionFragment: 'getDeposit', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'getDepositsLength', values: [string]): string;
  encodeFunctionData(functionFragment: 'ilv', values?: undefined): string;
  encodeFunctionData(functionFragment: 'isFlashPool', values?: undefined): string;
  encodeFunctionData(functionFragment: 'lastYieldDistribution', values?: undefined): string;
  encodeFunctionData(functionFragment: 'now256', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pendingVaultRewards', values: [string]): string;
  encodeFunctionData(functionFragment: 'pendingYieldRewards', values: [string]): string;
  encodeFunctionData(functionFragment: 'poolToken', values?: undefined): string;
  encodeFunctionData(functionFragment: 'poolTokenReserve', values?: undefined): string;
  encodeFunctionData(functionFragment: 'processRewards', values: [boolean]): string;
  encodeFunctionData(functionFragment: 'receiveVaultRewards', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'rewardToWeight', values: [BigNumberish, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'setVault', values: [string]): string;
  encodeFunctionData(functionFragment: 'setWeight', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'silv', values?: undefined): string;
  encodeFunctionData(functionFragment: 'stake', values: [BigNumberish, BigNumberish, boolean]): string;
  encodeFunctionData(functionFragment: 'stakeAsPool', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'sync', values?: undefined): string;
  encodeFunctionData(functionFragment: 'unstake', values: [BigNumberish, BigNumberish, boolean]): string;
  encodeFunctionData(functionFragment: 'updateStakeLock', values: [BigNumberish, BigNumberish, boolean]): string;
  encodeFunctionData(functionFragment: 'users', values: [string]): string;
  encodeFunctionData(functionFragment: 'usersLockingWeight', values?: undefined): string;
  encodeFunctionData(functionFragment: 'vault', values?: undefined): string;
  encodeFunctionData(functionFragment: 'vaultRewardsPerWeight', values?: undefined): string;
  encodeFunctionData(functionFragment: 'weight', values?: undefined): string;
  encodeFunctionData(functionFragment: 'weightToReward', values: [BigNumberish, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'yieldRewardsPerWeight', values?: undefined): string;

  decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'blockNumber', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'factory', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getDeposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getDepositsLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'ilv', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'isFlashPool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lastYieldDistribution', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'now256', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingVaultRewards', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingYieldRewards', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolTokenReserve', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'processRewards', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'receiveVaultRewards', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardToWeight', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setVault', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setWeight', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'silv', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'stake', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'stakeAsPool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'sync', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'unstake', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updateStakeLock', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'users', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'usersLockingWeight', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'vault', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'vaultRewardsPerWeight', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'weight', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'weightToReward', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'yieldRewardsPerWeight', data: BytesLike): Result;

  events: {
    'PoolWeightUpdated(address,uint32,uint32)': EventFragment;
    'StakeLockUpdated(address,uint256,uint64,uint64)': EventFragment;
    'Staked(address,address,uint256)': EventFragment;
    'Synchronized(address,uint256,uint64)': EventFragment;
    'Unstaked(address,address,uint256)': EventFragment;
    'VaultRewardsClaimed(address,address,uint256)': EventFragment;
    'VaultRewardsReceived(address,uint256)': EventFragment;
    'VaultUpdated(address,address,address)': EventFragment;
    'YieldClaimed(address,address,bool,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'PoolWeightUpdated'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'StakeLockUpdated'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Staked'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Synchronized'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Unstaked'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'VaultRewardsClaimed'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'VaultRewardsReceived'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'VaultUpdated'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'YieldClaimed'): EventFragment;
}

export interface PoolWeightUpdatedEventObject {
  _by: string;
  _fromVal: number;
  _toVal: number;
}
export type PoolWeightUpdatedEvent = TypedEvent<[string, number, number], PoolWeightUpdatedEventObject>;

export type PoolWeightUpdatedEventFilter = TypedEventFilter<PoolWeightUpdatedEvent>;

export interface StakeLockUpdatedEventObject {
  _by: string;
  depositId: BigNumber;
  lockedFrom: BigNumber;
  lockedUntil: BigNumber;
}
export type StakeLockUpdatedEvent = TypedEvent<[string, BigNumber, BigNumber, BigNumber], StakeLockUpdatedEventObject>;

export type StakeLockUpdatedEventFilter = TypedEventFilter<StakeLockUpdatedEvent>;

export interface StakedEventObject {
  _by: string;
  _from: string;
  amount: BigNumber;
}
export type StakedEvent = TypedEvent<[string, string, BigNumber], StakedEventObject>;

export type StakedEventFilter = TypedEventFilter<StakedEvent>;

export interface SynchronizedEventObject {
  _by: string;
  yieldRewardsPerWeight: BigNumber;
  lastYieldDistribution: BigNumber;
}
export type SynchronizedEvent = TypedEvent<[string, BigNumber, BigNumber], SynchronizedEventObject>;

export type SynchronizedEventFilter = TypedEventFilter<SynchronizedEvent>;

export interface UnstakedEventObject {
  _by: string;
  _to: string;
  amount: BigNumber;
}
export type UnstakedEvent = TypedEvent<[string, string, BigNumber], UnstakedEventObject>;

export type UnstakedEventFilter = TypedEventFilter<UnstakedEvent>;

export interface VaultRewardsClaimedEventObject {
  _by: string;
  _to: string;
  amount: BigNumber;
}
export type VaultRewardsClaimedEvent = TypedEvent<[string, string, BigNumber], VaultRewardsClaimedEventObject>;

export type VaultRewardsClaimedEventFilter = TypedEventFilter<VaultRewardsClaimedEvent>;

export interface VaultRewardsReceivedEventObject {
  _by: string;
  amount: BigNumber;
}
export type VaultRewardsReceivedEvent = TypedEvent<[string, BigNumber], VaultRewardsReceivedEventObject>;

export type VaultRewardsReceivedEventFilter = TypedEventFilter<VaultRewardsReceivedEvent>;

export interface VaultUpdatedEventObject {
  _by: string;
  _fromVal: string;
  _toVal: string;
}
export type VaultUpdatedEvent = TypedEvent<[string, string, string], VaultUpdatedEventObject>;

export type VaultUpdatedEventFilter = TypedEventFilter<VaultUpdatedEvent>;

export interface YieldClaimedEventObject {
  _by: string;
  _to: string;
  sIlv: boolean;
  amount: BigNumber;
}
export type YieldClaimedEvent = TypedEvent<[string, string, boolean, BigNumber], YieldClaimedEventObject>;

export type YieldClaimedEventFilter = TypedEventFilter<YieldClaimedEvent>;

export interface IlluviumCorePool extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IlluviumCorePoolInterface;

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
    balanceOf(_user: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    blockNumber(overrides?: CallOverrides): Promise<[BigNumber]>;

    factory(overrides?: CallOverrides): Promise<[string]>;

    getDeposit(
      _user: string,
      _depositId: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[IPool.DepositStructOutput]>;

    getDepositsLength(_user: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    ilv(overrides?: CallOverrides): Promise<[string]>;

    isFlashPool(overrides?: CallOverrides): Promise<[boolean]>;

    lastYieldDistribution(overrides?: CallOverrides): Promise<[BigNumber]>;

    now256(overrides?: CallOverrides): Promise<[BigNumber]>;

    pendingVaultRewards(_staker: string, overrides?: CallOverrides): Promise<[BigNumber] & { pending: BigNumber }>;

    pendingYieldRewards(_staker: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    poolToken(overrides?: CallOverrides): Promise<[string]>;

    poolTokenReserve(overrides?: CallOverrides): Promise<[BigNumber]>;

    processRewards(
      _useSILV: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    receiveVaultRewards(
      _rewardsAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    rewardToWeight(
      reward: BigNumberish,
      rewardPerWeight: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    setVault(_vault: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    setWeight(
      _weight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    silv(overrides?: CallOverrides): Promise<[string]>;

    stake(
      _amount: BigNumberish,
      _lockUntil: BigNumberish,
      _useSILV: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    stakeAsPool(
      _staker: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    sync(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    unstake(
      _depositId: BigNumberish,
      _amount: BigNumberish,
      _useSILV: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    updateStakeLock(
      depositId: BigNumberish,
      lockedUntil: BigNumberish,
      useSILV: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    users(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        tokenAmount: BigNumber;
        totalWeight: BigNumber;
        subYieldRewards: BigNumber;
        subVaultRewards: BigNumber;
      }
    >;

    usersLockingWeight(overrides?: CallOverrides): Promise<[BigNumber]>;

    vault(overrides?: CallOverrides): Promise<[string]>;

    vaultRewardsPerWeight(overrides?: CallOverrides): Promise<[BigNumber]>;

    weight(overrides?: CallOverrides): Promise<[number]>;

    weightToReward(
      _weight: BigNumberish,
      rewardPerWeight: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    yieldRewardsPerWeight(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  balanceOf(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

  blockNumber(overrides?: CallOverrides): Promise<BigNumber>;

  factory(overrides?: CallOverrides): Promise<string>;

  getDeposit(_user: string, _depositId: BigNumberish, overrides?: CallOverrides): Promise<IPool.DepositStructOutput>;

  getDepositsLength(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

  ilv(overrides?: CallOverrides): Promise<string>;

  isFlashPool(overrides?: CallOverrides): Promise<boolean>;

  lastYieldDistribution(overrides?: CallOverrides): Promise<BigNumber>;

  now256(overrides?: CallOverrides): Promise<BigNumber>;

  pendingVaultRewards(_staker: string, overrides?: CallOverrides): Promise<BigNumber>;

  pendingYieldRewards(_staker: string, overrides?: CallOverrides): Promise<BigNumber>;

  poolToken(overrides?: CallOverrides): Promise<string>;

  poolTokenReserve(overrides?: CallOverrides): Promise<BigNumber>;

  processRewards(
    _useSILV: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  receiveVaultRewards(
    _rewardsAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  rewardToWeight(reward: BigNumberish, rewardPerWeight: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  setVault(_vault: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  setWeight(
    _weight: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  silv(overrides?: CallOverrides): Promise<string>;

  stake(
    _amount: BigNumberish,
    _lockUntil: BigNumberish,
    _useSILV: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  stakeAsPool(
    _staker: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  sync(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  unstake(
    _depositId: BigNumberish,
    _amount: BigNumberish,
    _useSILV: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  updateStakeLock(
    depositId: BigNumberish,
    lockedUntil: BigNumberish,
    useSILV: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  users(
    arg0: string,
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      tokenAmount: BigNumber;
      totalWeight: BigNumber;
      subYieldRewards: BigNumber;
      subVaultRewards: BigNumber;
    }
  >;

  usersLockingWeight(overrides?: CallOverrides): Promise<BigNumber>;

  vault(overrides?: CallOverrides): Promise<string>;

  vaultRewardsPerWeight(overrides?: CallOverrides): Promise<BigNumber>;

  weight(overrides?: CallOverrides): Promise<number>;

  weightToReward(_weight: BigNumberish, rewardPerWeight: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  yieldRewardsPerWeight(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    balanceOf(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    blockNumber(overrides?: CallOverrides): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<string>;

    getDeposit(_user: string, _depositId: BigNumberish, overrides?: CallOverrides): Promise<IPool.DepositStructOutput>;

    getDepositsLength(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    ilv(overrides?: CallOverrides): Promise<string>;

    isFlashPool(overrides?: CallOverrides): Promise<boolean>;

    lastYieldDistribution(overrides?: CallOverrides): Promise<BigNumber>;

    now256(overrides?: CallOverrides): Promise<BigNumber>;

    pendingVaultRewards(_staker: string, overrides?: CallOverrides): Promise<BigNumber>;

    pendingYieldRewards(_staker: string, overrides?: CallOverrides): Promise<BigNumber>;

    poolToken(overrides?: CallOverrides): Promise<string>;

    poolTokenReserve(overrides?: CallOverrides): Promise<BigNumber>;

    processRewards(_useSILV: boolean, overrides?: CallOverrides): Promise<void>;

    receiveVaultRewards(_rewardsAmount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    rewardToWeight(reward: BigNumberish, rewardPerWeight: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    setVault(_vault: string, overrides?: CallOverrides): Promise<void>;

    setWeight(_weight: BigNumberish, overrides?: CallOverrides): Promise<void>;

    silv(overrides?: CallOverrides): Promise<string>;

    stake(_amount: BigNumberish, _lockUntil: BigNumberish, _useSILV: boolean, overrides?: CallOverrides): Promise<void>;

    stakeAsPool(_staker: string, _amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    sync(overrides?: CallOverrides): Promise<void>;

    unstake(
      _depositId: BigNumberish,
      _amount: BigNumberish,
      _useSILV: boolean,
      overrides?: CallOverrides,
    ): Promise<void>;

    updateStakeLock(
      depositId: BigNumberish,
      lockedUntil: BigNumberish,
      useSILV: boolean,
      overrides?: CallOverrides,
    ): Promise<void>;

    users(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        tokenAmount: BigNumber;
        totalWeight: BigNumber;
        subYieldRewards: BigNumber;
        subVaultRewards: BigNumber;
      }
    >;

    usersLockingWeight(overrides?: CallOverrides): Promise<BigNumber>;

    vault(overrides?: CallOverrides): Promise<string>;

    vaultRewardsPerWeight(overrides?: CallOverrides): Promise<BigNumber>;

    weight(overrides?: CallOverrides): Promise<number>;

    weightToReward(_weight: BigNumberish, rewardPerWeight: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    yieldRewardsPerWeight(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    'PoolWeightUpdated(address,uint32,uint32)'(
      _by?: string | null,
      _fromVal?: null,
      _toVal?: null,
    ): PoolWeightUpdatedEventFilter;
    PoolWeightUpdated(_by?: string | null, _fromVal?: null, _toVal?: null): PoolWeightUpdatedEventFilter;

    'StakeLockUpdated(address,uint256,uint64,uint64)'(
      _by?: string | null,
      depositId?: null,
      lockedFrom?: null,
      lockedUntil?: null,
    ): StakeLockUpdatedEventFilter;
    StakeLockUpdated(
      _by?: string | null,
      depositId?: null,
      lockedFrom?: null,
      lockedUntil?: null,
    ): StakeLockUpdatedEventFilter;

    'Staked(address,address,uint256)'(_by?: string | null, _from?: string | null, amount?: null): StakedEventFilter;
    Staked(_by?: string | null, _from?: string | null, amount?: null): StakedEventFilter;

    'Synchronized(address,uint256,uint64)'(
      _by?: string | null,
      yieldRewardsPerWeight?: null,
      lastYieldDistribution?: null,
    ): SynchronizedEventFilter;
    Synchronized(
      _by?: string | null,
      yieldRewardsPerWeight?: null,
      lastYieldDistribution?: null,
    ): SynchronizedEventFilter;

    'Unstaked(address,address,uint256)'(_by?: string | null, _to?: string | null, amount?: null): UnstakedEventFilter;
    Unstaked(_by?: string | null, _to?: string | null, amount?: null): UnstakedEventFilter;

    'VaultRewardsClaimed(address,address,uint256)'(
      _by?: string | null,
      _to?: string | null,
      amount?: null,
    ): VaultRewardsClaimedEventFilter;
    VaultRewardsClaimed(_by?: string | null, _to?: string | null, amount?: null): VaultRewardsClaimedEventFilter;

    'VaultRewardsReceived(address,uint256)'(_by?: string | null, amount?: null): VaultRewardsReceivedEventFilter;
    VaultRewardsReceived(_by?: string | null, amount?: null): VaultRewardsReceivedEventFilter;

    'VaultUpdated(address,address,address)'(
      _by?: string | null,
      _fromVal?: null,
      _toVal?: null,
    ): VaultUpdatedEventFilter;
    VaultUpdated(_by?: string | null, _fromVal?: null, _toVal?: null): VaultUpdatedEventFilter;

    'YieldClaimed(address,address,bool,uint256)'(
      _by?: string | null,
      _to?: string | null,
      sIlv?: null,
      amount?: null,
    ): YieldClaimedEventFilter;
    YieldClaimed(_by?: string | null, _to?: string | null, sIlv?: null, amount?: null): YieldClaimedEventFilter;
  };

  estimateGas: {
    balanceOf(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    blockNumber(overrides?: CallOverrides): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<BigNumber>;

    getDeposit(_user: string, _depositId: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    getDepositsLength(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    ilv(overrides?: CallOverrides): Promise<BigNumber>;

    isFlashPool(overrides?: CallOverrides): Promise<BigNumber>;

    lastYieldDistribution(overrides?: CallOverrides): Promise<BigNumber>;

    now256(overrides?: CallOverrides): Promise<BigNumber>;

    pendingVaultRewards(_staker: string, overrides?: CallOverrides): Promise<BigNumber>;

    pendingYieldRewards(_staker: string, overrides?: CallOverrides): Promise<BigNumber>;

    poolToken(overrides?: CallOverrides): Promise<BigNumber>;

    poolTokenReserve(overrides?: CallOverrides): Promise<BigNumber>;

    processRewards(_useSILV: boolean, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    receiveVaultRewards(
      _rewardsAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    rewardToWeight(reward: BigNumberish, rewardPerWeight: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    setVault(_vault: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    setWeight(_weight: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    silv(overrides?: CallOverrides): Promise<BigNumber>;

    stake(
      _amount: BigNumberish,
      _lockUntil: BigNumberish,
      _useSILV: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    stakeAsPool(
      _staker: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    sync(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    unstake(
      _depositId: BigNumberish,
      _amount: BigNumberish,
      _useSILV: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    updateStakeLock(
      depositId: BigNumberish,
      lockedUntil: BigNumberish,
      useSILV: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    users(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    usersLockingWeight(overrides?: CallOverrides): Promise<BigNumber>;

    vault(overrides?: CallOverrides): Promise<BigNumber>;

    vaultRewardsPerWeight(overrides?: CallOverrides): Promise<BigNumber>;

    weight(overrides?: CallOverrides): Promise<BigNumber>;

    weightToReward(_weight: BigNumberish, rewardPerWeight: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    yieldRewardsPerWeight(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOf(_user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    blockNumber(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    factory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getDeposit(_user: string, _depositId: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getDepositsLength(_user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ilv(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isFlashPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lastYieldDistribution(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    now256(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingVaultRewards(_staker: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingYieldRewards(_staker: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolTokenReserve(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    processRewards(
      _useSILV: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    receiveVaultRewards(
      _rewardsAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    rewardToWeight(
      reward: BigNumberish,
      rewardPerWeight: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    setVault(
      _vault: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setWeight(
      _weight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    silv(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    stake(
      _amount: BigNumberish,
      _lockUntil: BigNumberish,
      _useSILV: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    stakeAsPool(
      _staker: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    sync(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    unstake(
      _depositId: BigNumberish,
      _amount: BigNumberish,
      _useSILV: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    updateStakeLock(
      depositId: BigNumberish,
      lockedUntil: BigNumberish,
      useSILV: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    users(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    usersLockingWeight(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    vault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    vaultRewardsPerWeight(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    weight(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    weightToReward(
      _weight: BigNumberish,
      rewardPerWeight: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    yieldRewardsPerWeight(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
