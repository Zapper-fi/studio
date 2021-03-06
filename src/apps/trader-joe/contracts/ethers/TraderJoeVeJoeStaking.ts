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

export interface TraderJoeVeJoeStakingInterface extends utils.Interface {
  functions: {
    'ACC_VEJOE_PER_SHARE_PRECISION()': FunctionFragment;
    'VEJOE_PER_SHARE_PER_SEC_PRECISION()': FunctionFragment;
    'accVeJoePerShare()': FunctionFragment;
    'claim()': FunctionFragment;
    'deposit(uint256)': FunctionFragment;
    'getPendingVeJoe(address)': FunctionFragment;
    'initialize(address,address,uint256,uint256,uint256,uint256,uint256)': FunctionFragment;
    'joe()': FunctionFragment;
    'lastRewardTimestamp()': FunctionFragment;
    'maxCapPct()': FunctionFragment;
    'owner()': FunctionFragment;
    'renounceOwnership()': FunctionFragment;
    'setMaxCapPct(uint256)': FunctionFragment;
    'setSpeedUpThreshold(uint256)': FunctionFragment;
    'setVeJoePerSharePerSec(uint256)': FunctionFragment;
    'speedUpDuration()': FunctionFragment;
    'speedUpThreshold()': FunctionFragment;
    'speedUpVeJoePerSharePerSec()': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
    'updateRewardVars()': FunctionFragment;
    'upperLimitMaxCapPct()': FunctionFragment;
    'upperLimitVeJoePerSharePerSec()': FunctionFragment;
    'userInfos(address)': FunctionFragment;
    'veJoe()': FunctionFragment;
    'veJoePerSharePerSec()': FunctionFragment;
    'withdraw(uint256)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'ACC_VEJOE_PER_SHARE_PRECISION'
      | 'VEJOE_PER_SHARE_PER_SEC_PRECISION'
      | 'accVeJoePerShare'
      | 'claim'
      | 'deposit'
      | 'getPendingVeJoe'
      | 'initialize'
      | 'joe'
      | 'lastRewardTimestamp'
      | 'maxCapPct'
      | 'owner'
      | 'renounceOwnership'
      | 'setMaxCapPct'
      | 'setSpeedUpThreshold'
      | 'setVeJoePerSharePerSec'
      | 'speedUpDuration'
      | 'speedUpThreshold'
      | 'speedUpVeJoePerSharePerSec'
      | 'transferOwnership'
      | 'updateRewardVars'
      | 'upperLimitMaxCapPct'
      | 'upperLimitVeJoePerSharePerSec'
      | 'userInfos'
      | 'veJoe'
      | 'veJoePerSharePerSec'
      | 'withdraw',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'ACC_VEJOE_PER_SHARE_PRECISION', values?: undefined): string;
  encodeFunctionData(functionFragment: 'VEJOE_PER_SHARE_PER_SEC_PRECISION', values?: undefined): string;
  encodeFunctionData(functionFragment: 'accVeJoePerShare', values?: undefined): string;
  encodeFunctionData(functionFragment: 'claim', values?: undefined): string;
  encodeFunctionData(functionFragment: 'deposit', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'getPendingVeJoe', values: [string]): string;
  encodeFunctionData(
    functionFragment: 'initialize',
    values: [string, string, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish],
  ): string;
  encodeFunctionData(functionFragment: 'joe', values?: undefined): string;
  encodeFunctionData(functionFragment: 'lastRewardTimestamp', values?: undefined): string;
  encodeFunctionData(functionFragment: 'maxCapPct', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'setMaxCapPct', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'setSpeedUpThreshold', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'setVeJoePerSharePerSec', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'speedUpDuration', values?: undefined): string;
  encodeFunctionData(functionFragment: 'speedUpThreshold', values?: undefined): string;
  encodeFunctionData(functionFragment: 'speedUpVeJoePerSharePerSec', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [string]): string;
  encodeFunctionData(functionFragment: 'updateRewardVars', values?: undefined): string;
  encodeFunctionData(functionFragment: 'upperLimitMaxCapPct', values?: undefined): string;
  encodeFunctionData(functionFragment: 'upperLimitVeJoePerSharePerSec', values?: undefined): string;
  encodeFunctionData(functionFragment: 'userInfos', values: [string]): string;
  encodeFunctionData(functionFragment: 'veJoe', values?: undefined): string;
  encodeFunctionData(functionFragment: 'veJoePerSharePerSec', values?: undefined): string;
  encodeFunctionData(functionFragment: 'withdraw', values: [BigNumberish]): string;

  decodeFunctionResult(functionFragment: 'ACC_VEJOE_PER_SHARE_PRECISION', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'VEJOE_PER_SHARE_PER_SEC_PRECISION', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'accVeJoePerShare', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claim', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getPendingVeJoe', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'initialize', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'joe', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lastRewardTimestamp', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'maxCapPct', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setMaxCapPct', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setSpeedUpThreshold', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setVeJoePerSharePerSec', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'speedUpDuration', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'speedUpThreshold', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'speedUpVeJoePerSharePerSec', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updateRewardVars', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'upperLimitMaxCapPct', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'upperLimitVeJoePerSharePerSec', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'userInfos', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'veJoe', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'veJoePerSharePerSec', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;

  events: {
    'Claim(address,uint256)': EventFragment;
    'Deposit(address,uint256)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'UpdateMaxCapPct(address,uint256)': EventFragment;
    'UpdateRewardVars(uint256,uint256)': EventFragment;
    'UpdateSpeedUpThreshold(address,uint256)': EventFragment;
    'UpdateVeJoePerSharePerSec(address,uint256)': EventFragment;
    'Withdraw(address,uint256,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Claim'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Deposit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'UpdateMaxCapPct'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'UpdateRewardVars'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'UpdateSpeedUpThreshold'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'UpdateVeJoePerSharePerSec'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdraw'): EventFragment;
}

export interface ClaimEventObject {
  user: string;
  amount: BigNumber;
}
export type ClaimEvent = TypedEvent<[string, BigNumber], ClaimEventObject>;

export type ClaimEventFilter = TypedEventFilter<ClaimEvent>;

export interface DepositEventObject {
  user: string;
  amount: BigNumber;
}
export type DepositEvent = TypedEvent<[string, BigNumber], DepositEventObject>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[string, string], OwnershipTransferredEventObject>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface UpdateMaxCapPctEventObject {
  user: string;
  maxCapPct: BigNumber;
}
export type UpdateMaxCapPctEvent = TypedEvent<[string, BigNumber], UpdateMaxCapPctEventObject>;

export type UpdateMaxCapPctEventFilter = TypedEventFilter<UpdateMaxCapPctEvent>;

export interface UpdateRewardVarsEventObject {
  lastRewardTimestamp: BigNumber;
  accVeJoePerShare: BigNumber;
}
export type UpdateRewardVarsEvent = TypedEvent<[BigNumber, BigNumber], UpdateRewardVarsEventObject>;

export type UpdateRewardVarsEventFilter = TypedEventFilter<UpdateRewardVarsEvent>;

export interface UpdateSpeedUpThresholdEventObject {
  user: string;
  speedUpThreshold: BigNumber;
}
export type UpdateSpeedUpThresholdEvent = TypedEvent<[string, BigNumber], UpdateSpeedUpThresholdEventObject>;

export type UpdateSpeedUpThresholdEventFilter = TypedEventFilter<UpdateSpeedUpThresholdEvent>;

export interface UpdateVeJoePerSharePerSecEventObject {
  user: string;
  veJoePerSharePerSec: BigNumber;
}
export type UpdateVeJoePerSharePerSecEvent = TypedEvent<[string, BigNumber], UpdateVeJoePerSharePerSecEventObject>;

export type UpdateVeJoePerSharePerSecEventFilter = TypedEventFilter<UpdateVeJoePerSharePerSecEvent>;

export interface WithdrawEventObject {
  user: string;
  withdrawAmount: BigNumber;
  burnAmount: BigNumber;
}
export type WithdrawEvent = TypedEvent<[string, BigNumber, BigNumber], WithdrawEventObject>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface TraderJoeVeJoeStaking extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TraderJoeVeJoeStakingInterface;

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
    ACC_VEJOE_PER_SHARE_PRECISION(overrides?: CallOverrides): Promise<[BigNumber]>;

    VEJOE_PER_SHARE_PER_SEC_PRECISION(overrides?: CallOverrides): Promise<[BigNumber]>;

    accVeJoePerShare(overrides?: CallOverrides): Promise<[BigNumber]>;

    claim(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    deposit(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    getPendingVeJoe(_user: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    initialize(
      _joe: string,
      _veJoe: string,
      _veJoePerSharePerSec: BigNumberish,
      _speedUpVeJoePerSharePerSec: BigNumberish,
      _speedUpThreshold: BigNumberish,
      _speedUpDuration: BigNumberish,
      _maxCapPct: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    joe(overrides?: CallOverrides): Promise<[string]>;

    lastRewardTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxCapPct(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    setMaxCapPct(
      _maxCapPct: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setSpeedUpThreshold(
      _speedUpThreshold: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setVeJoePerSharePerSec(
      _veJoePerSharePerSec: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    speedUpDuration(overrides?: CallOverrides): Promise<[BigNumber]>;

    speedUpThreshold(overrides?: CallOverrides): Promise<[BigNumber]>;

    speedUpVeJoePerSharePerSec(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    updateRewardVars(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    upperLimitMaxCapPct(overrides?: CallOverrides): Promise<[BigNumber]>;

    upperLimitVeJoePerSharePerSec(overrides?: CallOverrides): Promise<[BigNumber]>;

    userInfos(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        balance: BigNumber;
        rewardDebt: BigNumber;
        lastClaimTimestamp: BigNumber;
        speedUpEndTimestamp: BigNumber;
      }
    >;

    veJoe(overrides?: CallOverrides): Promise<[string]>;

    veJoePerSharePerSec(overrides?: CallOverrides): Promise<[BigNumber]>;

    withdraw(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;
  };

  ACC_VEJOE_PER_SHARE_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

  VEJOE_PER_SHARE_PER_SEC_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

  accVeJoePerShare(overrides?: CallOverrides): Promise<BigNumber>;

  claim(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  deposit(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  getPendingVeJoe(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

  initialize(
    _joe: string,
    _veJoe: string,
    _veJoePerSharePerSec: BigNumberish,
    _speedUpVeJoePerSharePerSec: BigNumberish,
    _speedUpThreshold: BigNumberish,
    _speedUpDuration: BigNumberish,
    _maxCapPct: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  joe(overrides?: CallOverrides): Promise<string>;

  lastRewardTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

  maxCapPct(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  setMaxCapPct(
    _maxCapPct: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setSpeedUpThreshold(
    _speedUpThreshold: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setVeJoePerSharePerSec(
    _veJoePerSharePerSec: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  speedUpDuration(overrides?: CallOverrides): Promise<BigNumber>;

  speedUpThreshold(overrides?: CallOverrides): Promise<BigNumber>;

  speedUpVeJoePerSharePerSec(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  updateRewardVars(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  upperLimitMaxCapPct(overrides?: CallOverrides): Promise<BigNumber>;

  upperLimitVeJoePerSharePerSec(overrides?: CallOverrides): Promise<BigNumber>;

  userInfos(
    arg0: string,
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      balance: BigNumber;
      rewardDebt: BigNumber;
      lastClaimTimestamp: BigNumber;
      speedUpEndTimestamp: BigNumber;
    }
  >;

  veJoe(overrides?: CallOverrides): Promise<string>;

  veJoePerSharePerSec(overrides?: CallOverrides): Promise<BigNumber>;

  withdraw(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    ACC_VEJOE_PER_SHARE_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    VEJOE_PER_SHARE_PER_SEC_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    accVeJoePerShare(overrides?: CallOverrides): Promise<BigNumber>;

    claim(overrides?: CallOverrides): Promise<void>;

    deposit(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    getPendingVeJoe(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _joe: string,
      _veJoe: string,
      _veJoePerSharePerSec: BigNumberish,
      _speedUpVeJoePerSharePerSec: BigNumberish,
      _speedUpThreshold: BigNumberish,
      _speedUpDuration: BigNumberish,
      _maxCapPct: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    joe(overrides?: CallOverrides): Promise<string>;

    lastRewardTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    maxCapPct(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setMaxCapPct(_maxCapPct: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setSpeedUpThreshold(_speedUpThreshold: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setVeJoePerSharePerSec(_veJoePerSharePerSec: BigNumberish, overrides?: CallOverrides): Promise<void>;

    speedUpDuration(overrides?: CallOverrides): Promise<BigNumber>;

    speedUpThreshold(overrides?: CallOverrides): Promise<BigNumber>;

    speedUpVeJoePerSharePerSec(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(newOwner: string, overrides?: CallOverrides): Promise<void>;

    updateRewardVars(overrides?: CallOverrides): Promise<void>;

    upperLimitMaxCapPct(overrides?: CallOverrides): Promise<BigNumber>;

    upperLimitVeJoePerSharePerSec(overrides?: CallOverrides): Promise<BigNumber>;

    userInfos(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        balance: BigNumber;
        rewardDebt: BigNumber;
        lastClaimTimestamp: BigNumber;
        speedUpEndTimestamp: BigNumber;
      }
    >;

    veJoe(overrides?: CallOverrides): Promise<string>;

    veJoePerSharePerSec(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    'Claim(address,uint256)'(user?: string | null, amount?: null): ClaimEventFilter;
    Claim(user?: string | null, amount?: null): ClaimEventFilter;

    'Deposit(address,uint256)'(user?: string | null, amount?: null): DepositEventFilter;
    Deposit(user?: string | null, amount?: null): DepositEventFilter;

    'OwnershipTransferred(address,address)'(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): OwnershipTransferredEventFilter;

    'UpdateMaxCapPct(address,uint256)'(user?: string | null, maxCapPct?: null): UpdateMaxCapPctEventFilter;
    UpdateMaxCapPct(user?: string | null, maxCapPct?: null): UpdateMaxCapPctEventFilter;

    'UpdateRewardVars(uint256,uint256)'(
      lastRewardTimestamp?: null,
      accVeJoePerShare?: null,
    ): UpdateRewardVarsEventFilter;
    UpdateRewardVars(lastRewardTimestamp?: null, accVeJoePerShare?: null): UpdateRewardVarsEventFilter;

    'UpdateSpeedUpThreshold(address,uint256)'(
      user?: string | null,
      speedUpThreshold?: null,
    ): UpdateSpeedUpThresholdEventFilter;
    UpdateSpeedUpThreshold(user?: string | null, speedUpThreshold?: null): UpdateSpeedUpThresholdEventFilter;

    'UpdateVeJoePerSharePerSec(address,uint256)'(
      user?: string | null,
      veJoePerSharePerSec?: null,
    ): UpdateVeJoePerSharePerSecEventFilter;
    UpdateVeJoePerSharePerSec(user?: string | null, veJoePerSharePerSec?: null): UpdateVeJoePerSharePerSecEventFilter;

    'Withdraw(address,uint256,uint256)'(
      user?: string | null,
      withdrawAmount?: null,
      burnAmount?: null,
    ): WithdrawEventFilter;
    Withdraw(user?: string | null, withdrawAmount?: null, burnAmount?: null): WithdrawEventFilter;
  };

  estimateGas: {
    ACC_VEJOE_PER_SHARE_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    VEJOE_PER_SHARE_PER_SEC_PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    accVeJoePerShare(overrides?: CallOverrides): Promise<BigNumber>;

    claim(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    deposit(_amount: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    getPendingVeJoe(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _joe: string,
      _veJoe: string,
      _veJoePerSharePerSec: BigNumberish,
      _speedUpVeJoePerSharePerSec: BigNumberish,
      _speedUpThreshold: BigNumberish,
      _speedUpDuration: BigNumberish,
      _maxCapPct: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    joe(overrides?: CallOverrides): Promise<BigNumber>;

    lastRewardTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    maxCapPct(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    setMaxCapPct(
      _maxCapPct: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    setSpeedUpThreshold(
      _speedUpThreshold: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    setVeJoePerSharePerSec(
      _veJoePerSharePerSec: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    speedUpDuration(overrides?: CallOverrides): Promise<BigNumber>;

    speedUpThreshold(overrides?: CallOverrides): Promise<BigNumber>;

    speedUpVeJoePerSharePerSec(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    updateRewardVars(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    upperLimitMaxCapPct(overrides?: CallOverrides): Promise<BigNumber>;

    upperLimitVeJoePerSharePerSec(overrides?: CallOverrides): Promise<BigNumber>;

    userInfos(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    veJoe(overrides?: CallOverrides): Promise<BigNumber>;

    veJoePerSharePerSec(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(_amount: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;
  };

  populateTransaction: {
    ACC_VEJOE_PER_SHARE_PRECISION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    VEJOE_PER_SHARE_PER_SEC_PRECISION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    accVeJoePerShare(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claim(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    deposit(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    getPendingVeJoe(_user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _joe: string,
      _veJoe: string,
      _veJoePerSharePerSec: BigNumberish,
      _speedUpVeJoePerSharePerSec: BigNumberish,
      _speedUpThreshold: BigNumberish,
      _speedUpDuration: BigNumberish,
      _maxCapPct: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    joe(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lastRewardTimestamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxCapPct(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    setMaxCapPct(
      _maxCapPct: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setSpeedUpThreshold(
      _speedUpThreshold: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setVeJoePerSharePerSec(
      _veJoePerSharePerSec: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    speedUpDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    speedUpThreshold(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    speedUpVeJoePerSharePerSec(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    updateRewardVars(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    upperLimitMaxCapPct(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    upperLimitVeJoePerSharePerSec(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    userInfos(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    veJoe(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    veJoePerSharePerSec(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;
  };
}
