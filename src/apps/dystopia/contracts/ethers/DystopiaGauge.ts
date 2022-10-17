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

export interface DystopiaGaugeInterface extends utils.Interface {
  functions: {
    'balanceOf(address)': FunctionFragment;
    'batchUpdateRewardPerToken(address,uint256)': FunctionFragment;
    'bribe()': FunctionFragment;
    'checkpoints(address,uint256)': FunctionFragment;
    'claimFees()': FunctionFragment;
    'deposit(uint256,uint256)': FunctionFragment;
    'depositAll(uint256)': FunctionFragment;
    'derivedBalance(address)': FunctionFragment;
    'derivedBalances(address)': FunctionFragment;
    'derivedSupply()': FunctionFragment;
    'earned(address,address)': FunctionFragment;
    'fees0()': FunctionFragment;
    'fees1()': FunctionFragment;
    'getPriorBalanceIndex(address,uint256)': FunctionFragment;
    'getPriorRewardPerToken(address,uint256)': FunctionFragment;
    'getPriorSupplyIndex(uint256)': FunctionFragment;
    'getReward(address,address[])': FunctionFragment;
    'isRewardToken(address)': FunctionFragment;
    'lastEarn(address,address)': FunctionFragment;
    'lastUpdateTime(address)': FunctionFragment;
    'left(address)': FunctionFragment;
    'notifyRewardAmount(address,uint256)': FunctionFragment;
    'numCheckpoints(address)': FunctionFragment;
    'operator()': FunctionFragment;
    'periodFinish(address)': FunctionFragment;
    'registerRewardToken(address)': FunctionFragment;
    'removeRewardToken(address)': FunctionFragment;
    'rewardPerToken(address)': FunctionFragment;
    'rewardPerTokenCheckpoints(address,uint256)': FunctionFragment;
    'rewardPerTokenNumCheckpoints(address)': FunctionFragment;
    'rewardPerTokenStored(address)': FunctionFragment;
    'rewardRate(address)': FunctionFragment;
    'rewardTokens(uint256)': FunctionFragment;
    'rewardTokensLength()': FunctionFragment;
    'supplyCheckpoints(uint256)': FunctionFragment;
    'supplyNumCheckpoints()': FunctionFragment;
    'tokenIds(address)': FunctionFragment;
    'totalSupply()': FunctionFragment;
    'underlying()': FunctionFragment;
    'userRewardPerTokenStored(address,address)': FunctionFragment;
    've()': FunctionFragment;
    'voter()': FunctionFragment;
    'withdraw(uint256)': FunctionFragment;
    'withdrawAll()': FunctionFragment;
    'withdrawToken(uint256,uint256)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'balanceOf'
      | 'batchUpdateRewardPerToken'
      | 'bribe'
      | 'checkpoints'
      | 'claimFees'
      | 'deposit'
      | 'depositAll'
      | 'derivedBalance'
      | 'derivedBalances'
      | 'derivedSupply'
      | 'earned'
      | 'fees0'
      | 'fees1'
      | 'getPriorBalanceIndex'
      | 'getPriorRewardPerToken'
      | 'getPriorSupplyIndex'
      | 'getReward'
      | 'isRewardToken'
      | 'lastEarn'
      | 'lastUpdateTime'
      | 'left'
      | 'notifyRewardAmount'
      | 'numCheckpoints'
      | 'operator'
      | 'periodFinish'
      | 'registerRewardToken'
      | 'removeRewardToken'
      | 'rewardPerToken'
      | 'rewardPerTokenCheckpoints'
      | 'rewardPerTokenNumCheckpoints'
      | 'rewardPerTokenStored'
      | 'rewardRate'
      | 'rewardTokens'
      | 'rewardTokensLength'
      | 'supplyCheckpoints'
      | 'supplyNumCheckpoints'
      | 'tokenIds'
      | 'totalSupply'
      | 'underlying'
      | 'userRewardPerTokenStored'
      | 've'
      | 'voter'
      | 'withdraw'
      | 'withdrawAll'
      | 'withdrawToken',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'balanceOf', values: [string]): string;
  encodeFunctionData(functionFragment: 'batchUpdateRewardPerToken', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'bribe', values?: undefined): string;
  encodeFunctionData(functionFragment: 'checkpoints', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'claimFees', values?: undefined): string;
  encodeFunctionData(functionFragment: 'deposit', values: [BigNumberish, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'depositAll', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'derivedBalance', values: [string]): string;
  encodeFunctionData(functionFragment: 'derivedBalances', values: [string]): string;
  encodeFunctionData(functionFragment: 'derivedSupply', values?: undefined): string;
  encodeFunctionData(functionFragment: 'earned', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'fees0', values?: undefined): string;
  encodeFunctionData(functionFragment: 'fees1', values?: undefined): string;
  encodeFunctionData(functionFragment: 'getPriorBalanceIndex', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'getPriorRewardPerToken', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'getPriorSupplyIndex', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'getReward', values: [string, string[]]): string;
  encodeFunctionData(functionFragment: 'isRewardToken', values: [string]): string;
  encodeFunctionData(functionFragment: 'lastEarn', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'lastUpdateTime', values: [string]): string;
  encodeFunctionData(functionFragment: 'left', values: [string]): string;
  encodeFunctionData(functionFragment: 'notifyRewardAmount', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'numCheckpoints', values: [string]): string;
  encodeFunctionData(functionFragment: 'operator', values?: undefined): string;
  encodeFunctionData(functionFragment: 'periodFinish', values: [string]): string;
  encodeFunctionData(functionFragment: 'registerRewardToken', values: [string]): string;
  encodeFunctionData(functionFragment: 'removeRewardToken', values: [string]): string;
  encodeFunctionData(functionFragment: 'rewardPerToken', values: [string]): string;
  encodeFunctionData(functionFragment: 'rewardPerTokenCheckpoints', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'rewardPerTokenNumCheckpoints', values: [string]): string;
  encodeFunctionData(functionFragment: 'rewardPerTokenStored', values: [string]): string;
  encodeFunctionData(functionFragment: 'rewardRate', values: [string]): string;
  encodeFunctionData(functionFragment: 'rewardTokens', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'rewardTokensLength', values?: undefined): string;
  encodeFunctionData(functionFragment: 'supplyCheckpoints', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'supplyNumCheckpoints', values?: undefined): string;
  encodeFunctionData(functionFragment: 'tokenIds', values: [string]): string;
  encodeFunctionData(functionFragment: 'totalSupply', values?: undefined): string;
  encodeFunctionData(functionFragment: 'underlying', values?: undefined): string;
  encodeFunctionData(functionFragment: 'userRewardPerTokenStored', values: [string, string]): string;
  encodeFunctionData(functionFragment: 've', values?: undefined): string;
  encodeFunctionData(functionFragment: 'voter', values?: undefined): string;
  encodeFunctionData(functionFragment: 'withdraw', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'withdrawAll', values?: undefined): string;
  encodeFunctionData(functionFragment: 'withdrawToken', values: [BigNumberish, BigNumberish]): string;

  decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'batchUpdateRewardPerToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'bribe', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'checkpoints', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimFees', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'depositAll', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'derivedBalance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'derivedBalances', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'derivedSupply', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'earned', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'fees0', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'fees1', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getPriorBalanceIndex', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getPriorRewardPerToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getPriorSupplyIndex', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getReward', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'isRewardToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lastEarn', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lastUpdateTime', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'left', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'notifyRewardAmount', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'numCheckpoints', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'operator', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'periodFinish', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'registerRewardToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'removeRewardToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardPerToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardPerTokenCheckpoints', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardPerTokenNumCheckpoints', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardPerTokenStored', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardRate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardTokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardTokensLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'supplyCheckpoints', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'supplyNumCheckpoints', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'tokenIds', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'underlying', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'userRewardPerTokenStored', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 've', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'voter', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdrawAll', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdrawToken', data: BytesLike): Result;

  events: {
    'ClaimFees(address,uint256,uint256)': EventFragment;
    'ClaimRewards(address,address,uint256,address)': EventFragment;
    'Deposit(address,uint256)': EventFragment;
    'NotifyReward(address,address,uint256)': EventFragment;
    'VeTokenLocked(address,uint256)': EventFragment;
    'VeTokenUnlocked(address,uint256)': EventFragment;
    'Withdraw(address,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'ClaimFees'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'ClaimRewards'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Deposit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'NotifyReward'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'VeTokenLocked'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'VeTokenUnlocked'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdraw'): EventFragment;
}

export interface ClaimFeesEventObject {
  from: string;
  claimed0: BigNumber;
  claimed1: BigNumber;
}
export type ClaimFeesEvent = TypedEvent<[string, BigNumber, BigNumber], ClaimFeesEventObject>;

export type ClaimFeesEventFilter = TypedEventFilter<ClaimFeesEvent>;

export interface ClaimRewardsEventObject {
  from: string;
  reward: string;
  amount: BigNumber;
  recepient: string;
}
export type ClaimRewardsEvent = TypedEvent<[string, string, BigNumber, string], ClaimRewardsEventObject>;

export type ClaimRewardsEventFilter = TypedEventFilter<ClaimRewardsEvent>;

export interface DepositEventObject {
  from: string;
  amount: BigNumber;
}
export type DepositEvent = TypedEvent<[string, BigNumber], DepositEventObject>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface NotifyRewardEventObject {
  from: string;
  reward: string;
  amount: BigNumber;
}
export type NotifyRewardEvent = TypedEvent<[string, string, BigNumber], NotifyRewardEventObject>;

export type NotifyRewardEventFilter = TypedEventFilter<NotifyRewardEvent>;

export interface VeTokenLockedEventObject {
  account: string;
  tokenId: BigNumber;
}
export type VeTokenLockedEvent = TypedEvent<[string, BigNumber], VeTokenLockedEventObject>;

export type VeTokenLockedEventFilter = TypedEventFilter<VeTokenLockedEvent>;

export interface VeTokenUnlockedEventObject {
  account: string;
  tokenId: BigNumber;
}
export type VeTokenUnlockedEvent = TypedEvent<[string, BigNumber], VeTokenUnlockedEventObject>;

export type VeTokenUnlockedEventFilter = TypedEventFilter<VeTokenUnlockedEvent>;

export interface WithdrawEventObject {
  from: string;
  amount: BigNumber;
}
export type WithdrawEvent = TypedEvent<[string, BigNumber], WithdrawEventObject>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface DystopiaGauge extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DystopiaGaugeInterface;

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
    balanceOf(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    batchUpdateRewardPerToken(
      token: string,
      maxRuns: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    bribe(overrides?: CallOverrides): Promise<[string]>;

    checkpoints(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { timestamp: BigNumber; value: BigNumber }>;

    claimFees(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    deposit(
      amount: BigNumberish,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    depositAll(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    derivedBalance(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    derivedBalances(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    derivedSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    earned(token: string, account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    fees0(overrides?: CallOverrides): Promise<[BigNumber]>;

    fees1(overrides?: CallOverrides): Promise<[BigNumber]>;

    getPriorBalanceIndex(account: string, timestamp: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    getPriorRewardPerToken(
      token: string,
      timestamp: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber]>;

    getPriorSupplyIndex(timestamp: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    getReward(
      account: string,
      tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    isRewardToken(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    lastEarn(arg0: string, arg1: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    lastUpdateTime(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    left(token: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    notifyRewardAmount(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    numCheckpoints(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    operator(overrides?: CallOverrides): Promise<[string]>;

    periodFinish(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    registerRewardToken(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    removeRewardToken(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    rewardPerToken(token: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardPerTokenCheckpoints(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { timestamp: BigNumber; value: BigNumber }>;

    rewardPerTokenNumCheckpoints(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardPerTokenStored(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardRate(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    rewardTokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    rewardTokensLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    supplyCheckpoints(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { timestamp: BigNumber; value: BigNumber }>;

    supplyNumCheckpoints(overrides?: CallOverrides): Promise<[BigNumber]>;

    tokenIds(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    underlying(overrides?: CallOverrides): Promise<[string]>;

    userRewardPerTokenStored(arg0: string, arg1: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    ve(overrides?: CallOverrides): Promise<[string]>;

    voter(overrides?: CallOverrides): Promise<[string]>;

    withdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    withdrawAll(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    withdrawToken(
      amount: BigNumberish,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;
  };

  balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  batchUpdateRewardPerToken(
    token: string,
    maxRuns: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  bribe(overrides?: CallOverrides): Promise<string>;

  checkpoints(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber] & { timestamp: BigNumber; value: BigNumber }>;

  claimFees(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  deposit(
    amount: BigNumberish,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  depositAll(
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  derivedBalance(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  derivedBalances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  derivedSupply(overrides?: CallOverrides): Promise<BigNumber>;

  earned(token: string, account: string, overrides?: CallOverrides): Promise<BigNumber>;

  fees0(overrides?: CallOverrides): Promise<BigNumber>;

  fees1(overrides?: CallOverrides): Promise<BigNumber>;

  getPriorBalanceIndex(account: string, timestamp: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  getPriorRewardPerToken(
    token: string,
    timestamp: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber]>;

  getPriorSupplyIndex(timestamp: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  getReward(
    account: string,
    tokens: string[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  isRewardToken(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  lastEarn(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

  lastUpdateTime(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  left(token: string, overrides?: CallOverrides): Promise<BigNumber>;

  notifyRewardAmount(
    token: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  numCheckpoints(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  operator(overrides?: CallOverrides): Promise<string>;

  periodFinish(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  registerRewardToken(
    token: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  removeRewardToken(
    token: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  rewardPerToken(token: string, overrides?: CallOverrides): Promise<BigNumber>;

  rewardPerTokenCheckpoints(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber] & { timestamp: BigNumber; value: BigNumber }>;

  rewardPerTokenNumCheckpoints(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  rewardPerTokenStored(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  rewardRate(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  rewardTokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  rewardTokensLength(overrides?: CallOverrides): Promise<BigNumber>;

  supplyCheckpoints(
    arg0: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber] & { timestamp: BigNumber; value: BigNumber }>;

  supplyNumCheckpoints(overrides?: CallOverrides): Promise<BigNumber>;

  tokenIds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  underlying(overrides?: CallOverrides): Promise<string>;

  userRewardPerTokenStored(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

  ve(overrides?: CallOverrides): Promise<string>;

  voter(overrides?: CallOverrides): Promise<string>;

  withdraw(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  withdrawAll(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  withdrawToken(
    amount: BigNumberish,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    batchUpdateRewardPerToken(token: string, maxRuns: BigNumberish, overrides?: CallOverrides): Promise<void>;

    bribe(overrides?: CallOverrides): Promise<string>;

    checkpoints(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { timestamp: BigNumber; value: BigNumber }>;

    claimFees(
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { claimed0: BigNumber; claimed1: BigNumber }>;

    deposit(amount: BigNumberish, tokenId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    depositAll(tokenId: BigNumberish, overrides?: CallOverrides): Promise<void>;

    derivedBalance(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    derivedBalances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    derivedSupply(overrides?: CallOverrides): Promise<BigNumber>;

    earned(token: string, account: string, overrides?: CallOverrides): Promise<BigNumber>;

    fees0(overrides?: CallOverrides): Promise<BigNumber>;

    fees1(overrides?: CallOverrides): Promise<BigNumber>;

    getPriorBalanceIndex(account: string, timestamp: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    getPriorRewardPerToken(
      token: string,
      timestamp: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber]>;

    getPriorSupplyIndex(timestamp: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    getReward(account: string, tokens: string[], overrides?: CallOverrides): Promise<void>;

    isRewardToken(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    lastEarn(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    lastUpdateTime(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    left(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    notifyRewardAmount(token: string, amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    numCheckpoints(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    operator(overrides?: CallOverrides): Promise<string>;

    periodFinish(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    registerRewardToken(token: string, overrides?: CallOverrides): Promise<void>;

    removeRewardToken(token: string, overrides?: CallOverrides): Promise<void>;

    rewardPerToken(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerTokenCheckpoints(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { timestamp: BigNumber; value: BigNumber }>;

    rewardPerTokenNumCheckpoints(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerTokenStored(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    rewardRate(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    rewardTokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    rewardTokensLength(overrides?: CallOverrides): Promise<BigNumber>;

    supplyCheckpoints(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { timestamp: BigNumber; value: BigNumber }>;

    supplyNumCheckpoints(overrides?: CallOverrides): Promise<BigNumber>;

    tokenIds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    underlying(overrides?: CallOverrides): Promise<string>;

    userRewardPerTokenStored(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    ve(overrides?: CallOverrides): Promise<string>;

    voter(overrides?: CallOverrides): Promise<string>;

    withdraw(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    withdrawAll(overrides?: CallOverrides): Promise<void>;

    withdrawToken(amount: BigNumberish, tokenId: BigNumberish, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    'ClaimFees(address,uint256,uint256)'(from?: string | null, claimed0?: null, claimed1?: null): ClaimFeesEventFilter;
    ClaimFees(from?: string | null, claimed0?: null, claimed1?: null): ClaimFeesEventFilter;

    'ClaimRewards(address,address,uint256,address)'(
      from?: string | null,
      reward?: string | null,
      amount?: null,
      recepient?: null,
    ): ClaimRewardsEventFilter;
    ClaimRewards(
      from?: string | null,
      reward?: string | null,
      amount?: null,
      recepient?: null,
    ): ClaimRewardsEventFilter;

    'Deposit(address,uint256)'(from?: string | null, amount?: null): DepositEventFilter;
    Deposit(from?: string | null, amount?: null): DepositEventFilter;

    'NotifyReward(address,address,uint256)'(
      from?: string | null,
      reward?: string | null,
      amount?: null,
    ): NotifyRewardEventFilter;
    NotifyReward(from?: string | null, reward?: string | null, amount?: null): NotifyRewardEventFilter;

    'VeTokenLocked(address,uint256)'(account?: string | null, tokenId?: null): VeTokenLockedEventFilter;
    VeTokenLocked(account?: string | null, tokenId?: null): VeTokenLockedEventFilter;

    'VeTokenUnlocked(address,uint256)'(account?: string | null, tokenId?: null): VeTokenUnlockedEventFilter;
    VeTokenUnlocked(account?: string | null, tokenId?: null): VeTokenUnlockedEventFilter;

    'Withdraw(address,uint256)'(from?: string | null, amount?: null): WithdrawEventFilter;
    Withdraw(from?: string | null, amount?: null): WithdrawEventFilter;
  };

  estimateGas: {
    balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    batchUpdateRewardPerToken(
      token: string,
      maxRuns: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    bribe(overrides?: CallOverrides): Promise<BigNumber>;

    checkpoints(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    claimFees(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    deposit(
      amount: BigNumberish,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    depositAll(tokenId: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    derivedBalance(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    derivedBalances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    derivedSupply(overrides?: CallOverrides): Promise<BigNumber>;

    earned(token: string, account: string, overrides?: CallOverrides): Promise<BigNumber>;

    fees0(overrides?: CallOverrides): Promise<BigNumber>;

    fees1(overrides?: CallOverrides): Promise<BigNumber>;

    getPriorBalanceIndex(account: string, timestamp: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    getPriorRewardPerToken(token: string, timestamp: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    getPriorSupplyIndex(timestamp: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    getReward(
      account: string,
      tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    isRewardToken(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    lastEarn(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    lastUpdateTime(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    left(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    notifyRewardAmount(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    numCheckpoints(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    operator(overrides?: CallOverrides): Promise<BigNumber>;

    periodFinish(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    registerRewardToken(token: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    removeRewardToken(token: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    rewardPerToken(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerTokenCheckpoints(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerTokenNumCheckpoints(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    rewardPerTokenStored(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    rewardRate(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    rewardTokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    rewardTokensLength(overrides?: CallOverrides): Promise<BigNumber>;

    supplyCheckpoints(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    supplyNumCheckpoints(overrides?: CallOverrides): Promise<BigNumber>;

    tokenIds(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    underlying(overrides?: CallOverrides): Promise<BigNumber>;

    userRewardPerTokenStored(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    ve(overrides?: CallOverrides): Promise<BigNumber>;

    voter(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(amount: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    withdrawAll(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    withdrawToken(
      amount: BigNumberish,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOf(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    batchUpdateRewardPerToken(
      token: string,
      maxRuns: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    bribe(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    checkpoints(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimFees(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    deposit(
      amount: BigNumberish,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    depositAll(
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    derivedBalance(account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    derivedBalances(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    derivedSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    earned(token: string, account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    fees0(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    fees1(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPriorBalanceIndex(
      account: string,
      timestamp: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getPriorRewardPerToken(
      token: string,
      timestamp: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getPriorSupplyIndex(timestamp: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getReward(
      account: string,
      tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    isRewardToken(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lastEarn(arg0: string, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lastUpdateTime(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    left(token: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    notifyRewardAmount(
      token: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    numCheckpoints(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    operator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    periodFinish(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    registerRewardToken(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    removeRewardToken(
      token: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    rewardPerToken(token: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardPerTokenCheckpoints(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    rewardPerTokenNumCheckpoints(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardPerTokenStored(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardRate(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardTokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardTokensLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    supplyCheckpoints(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    supplyNumCheckpoints(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenIds(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    underlying(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    userRewardPerTokenStored(arg0: string, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ve(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    voter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    withdrawAll(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    withdrawToken(
      amount: BigNumberish,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;
  };
}
