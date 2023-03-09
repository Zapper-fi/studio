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

export interface HalofiAbiV001Interface extends utils.Interface {
  functions: {
    'activePlayersCount()': FunctionFragment;
    'adaiToken()': FunctionFragment;
    'adminFeeAmount()': FunctionFragment;
    'adminFeeWithdraw()': FunctionFragment;
    'adminWithdraw()': FunctionFragment;
    'claim(uint256,address,bool,bytes32[])': FunctionFragment;
    'customFee()': FunctionFragment;
    'daiToken()': FunctionFragment;
    'earlyWithdraw()': FunctionFragment;
    'earlyWithdrawalFee()': FunctionFragment;
    'firstSegmentStart()': FunctionFragment;
    'getCurrentSegment()': FunctionFragment;
    'getNumberOfPlayers()': FunctionFragment;
    'incentiveController()': FunctionFragment;
    'incentiveToken()': FunctionFragment;
    'isGameCompleted()': FunctionFragment;
    'iterablePlayers(uint256)': FunctionFragment;
    'lastSegment()': FunctionFragment;
    'lendingPool()': FunctionFragment;
    'lendingPoolAddressProvider()': FunctionFragment;
    'makeDeposit()': FunctionFragment;
    'matic()': FunctionFragment;
    'maxPlayersCount()': FunctionFragment;
    'merkleRoot()': FunctionFragment;
    'owner()': FunctionFragment;
    'pause()': FunctionFragment;
    'paused()': FunctionFragment;
    'players(address)': FunctionFragment;
    'redeemFromExternalPool()': FunctionFragment;
    'redeemed()': FunctionFragment;
    'renounceOwnership()': FunctionFragment;
    'rewardsPerPlayer()': FunctionFragment;
    'segmentLength()': FunctionFragment;
    'segmentPayment()': FunctionFragment;
    'totalGameInterest()': FunctionFragment;
    'totalGamePrincipal()': FunctionFragment;
    'totalIncentiveAmount()': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
    'unpause()': FunctionFragment;
    'winners(uint256)': FunctionFragment;
    'withdraw()': FunctionFragment;
    'joinGame()': FunctionFragment;
    'joinWhitelistedGame(uint256,bytes32[])': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'activePlayersCount'
      | 'adaiToken'
      | 'adminFeeAmount'
      | 'adminFeeWithdraw'
      | 'adminWithdraw'
      | 'claim'
      | 'customFee'
      | 'daiToken'
      | 'earlyWithdraw'
      | 'earlyWithdrawalFee'
      | 'firstSegmentStart'
      | 'getCurrentSegment'
      | 'getNumberOfPlayers'
      | 'incentiveController'
      | 'incentiveToken'
      | 'isGameCompleted'
      | 'iterablePlayers'
      | 'lastSegment'
      | 'lendingPool'
      | 'lendingPoolAddressProvider'
      | 'makeDeposit'
      | 'matic'
      | 'maxPlayersCount'
      | 'merkleRoot'
      | 'owner'
      | 'pause'
      | 'paused'
      | 'players'
      | 'redeemFromExternalPool'
      | 'redeemed'
      | 'renounceOwnership'
      | 'rewardsPerPlayer'
      | 'segmentLength'
      | 'segmentPayment'
      | 'totalGameInterest'
      | 'totalGamePrincipal'
      | 'totalIncentiveAmount'
      | 'transferOwnership'
      | 'unpause'
      | 'winners'
      | 'withdraw'
      | 'joinGame'
      | 'joinWhitelistedGame',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'activePlayersCount', values?: undefined): string;
  encodeFunctionData(functionFragment: 'adaiToken', values?: undefined): string;
  encodeFunctionData(functionFragment: 'adminFeeAmount', values?: undefined): string;
  encodeFunctionData(functionFragment: 'adminFeeWithdraw', values?: undefined): string;
  encodeFunctionData(functionFragment: 'adminWithdraw', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'claim',
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BytesLike>[],
    ],
  ): string;
  encodeFunctionData(functionFragment: 'customFee', values?: undefined): string;
  encodeFunctionData(functionFragment: 'daiToken', values?: undefined): string;
  encodeFunctionData(functionFragment: 'earlyWithdraw', values?: undefined): string;
  encodeFunctionData(functionFragment: 'earlyWithdrawalFee', values?: undefined): string;
  encodeFunctionData(functionFragment: 'firstSegmentStart', values?: undefined): string;
  encodeFunctionData(functionFragment: 'getCurrentSegment', values?: undefined): string;
  encodeFunctionData(functionFragment: 'getNumberOfPlayers', values?: undefined): string;
  encodeFunctionData(functionFragment: 'incentiveController', values?: undefined): string;
  encodeFunctionData(functionFragment: 'incentiveToken', values?: undefined): string;
  encodeFunctionData(functionFragment: 'isGameCompleted', values?: undefined): string;
  encodeFunctionData(functionFragment: 'iterablePlayers', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'lastSegment', values?: undefined): string;
  encodeFunctionData(functionFragment: 'lendingPool', values?: undefined): string;
  encodeFunctionData(functionFragment: 'lendingPoolAddressProvider', values?: undefined): string;
  encodeFunctionData(functionFragment: 'makeDeposit', values?: undefined): string;
  encodeFunctionData(functionFragment: 'matic', values?: undefined): string;
  encodeFunctionData(functionFragment: 'maxPlayersCount', values?: undefined): string;
  encodeFunctionData(functionFragment: 'merkleRoot', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pause', values?: undefined): string;
  encodeFunctionData(functionFragment: 'paused', values?: undefined): string;
  encodeFunctionData(functionFragment: 'players', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'redeemFromExternalPool', values?: undefined): string;
  encodeFunctionData(functionFragment: 'redeemed', values?: undefined): string;
  encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'rewardsPerPlayer', values?: undefined): string;
  encodeFunctionData(functionFragment: 'segmentLength', values?: undefined): string;
  encodeFunctionData(functionFragment: 'segmentPayment', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalGameInterest', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalGamePrincipal', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalIncentiveAmount', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'unpause', values?: undefined): string;
  encodeFunctionData(functionFragment: 'winners', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'withdraw', values?: undefined): string;
  encodeFunctionData(functionFragment: 'joinGame', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'joinWhitelistedGame',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>[]],
  ): string;

  decodeFunctionResult(functionFragment: 'activePlayersCount', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'adaiToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'adminFeeAmount', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'adminFeeWithdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'adminWithdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claim', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'customFee', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'daiToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'earlyWithdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'earlyWithdrawalFee', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'firstSegmentStart', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getCurrentSegment', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getNumberOfPlayers', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'incentiveController', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'incentiveToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'isGameCompleted', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'iterablePlayers', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lastSegment', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lendingPool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lendingPoolAddressProvider', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'makeDeposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'matic', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'maxPlayersCount', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'merkleRoot', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pause', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'paused', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'players', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'redeemFromExternalPool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'redeemed', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewardsPerPlayer', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'segmentLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'segmentPayment', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalGameInterest', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalGamePrincipal', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalIncentiveAmount', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'unpause', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'winners', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'joinGame', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'joinWhitelistedGame', data: BytesLike): Result;

  events: {
    'AdminWithdrawal(address,uint256,uint256,uint256)': EventFragment;
    'Deposit(address,uint256,uint256)': EventFragment;
    'EarlyWithdrawal(address,uint256,uint256)': EventFragment;
    'FundsRedeemedFromExternalPool(uint256,uint256,uint256,uint256,uint256)': EventFragment;
    'JoinedGame(address,uint256)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
    'Paused(address)': EventFragment;
    'Unpaused(address)': EventFragment;
    'WinnersAnnouncement(address[])': EventFragment;
    'Withdrawal(address,uint256,uint256,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'AdminWithdrawal'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Deposit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'EarlyWithdrawal'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'FundsRedeemedFromExternalPool'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'JoinedGame'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Paused'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Unpaused'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'WinnersAnnouncement'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdrawal'): EventFragment;
}

export interface AdminWithdrawalEventObject {
  admin: string;
  totalGameInterest: BigNumber;
  adminFeeAmount: BigNumber;
  adminIncentiveAmount: BigNumber;
}
export type AdminWithdrawalEvent = TypedEvent<[string, BigNumber, BigNumber, BigNumber], AdminWithdrawalEventObject>;

export type AdminWithdrawalEventFilter = TypedEventFilter<AdminWithdrawalEvent>;

export interface DepositEventObject {
  player: string;
  segment: BigNumber;
  amount: BigNumber;
}
export type DepositEvent = TypedEvent<[string, BigNumber, BigNumber], DepositEventObject>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface EarlyWithdrawalEventObject {
  player: string;
  amount: BigNumber;
  totalGamePrincipal: BigNumber;
}
export type EarlyWithdrawalEvent = TypedEvent<[string, BigNumber, BigNumber], EarlyWithdrawalEventObject>;

export type EarlyWithdrawalEventFilter = TypedEventFilter<EarlyWithdrawalEvent>;

export interface FundsRedeemedFromExternalPoolEventObject {
  totalAmount: BigNumber;
  totalGamePrincipal: BigNumber;
  totalGameInterest: BigNumber;
  rewards: BigNumber;
  totalIncentiveAmount: BigNumber;
}
export type FundsRedeemedFromExternalPoolEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber],
  FundsRedeemedFromExternalPoolEventObject
>;

export type FundsRedeemedFromExternalPoolEventFilter = TypedEventFilter<FundsRedeemedFromExternalPoolEvent>;

export interface JoinedGameEventObject {
  player: string;
  amount: BigNumber;
}
export type JoinedGameEvent = TypedEvent<[string, BigNumber], JoinedGameEventObject>;

export type JoinedGameEventFilter = TypedEventFilter<JoinedGameEvent>;

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

export interface WinnersAnnouncementEventObject {
  winners: string[];
}
export type WinnersAnnouncementEvent = TypedEvent<[string[]], WinnersAnnouncementEventObject>;

export type WinnersAnnouncementEventFilter = TypedEventFilter<WinnersAnnouncementEvent>;

export interface WithdrawalEventObject {
  player: string;
  amount: BigNumber;
  playerReward: BigNumber;
  playerIncentive: BigNumber;
}
export type WithdrawalEvent = TypedEvent<[string, BigNumber, BigNumber, BigNumber], WithdrawalEventObject>;

export type WithdrawalEventFilter = TypedEventFilter<WithdrawalEvent>;

export interface HalofiAbiV001 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: HalofiAbiV001Interface;

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
    activePlayersCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    adaiToken(overrides?: CallOverrides): Promise<[string]>;

    adminFeeAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    adminFeeWithdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    adminWithdraw(overrides?: CallOverrides): Promise<[boolean]>;

    claim(
      index: PromiseOrValue<BigNumberish>,
      account: PromiseOrValue<string>,
      isValid: PromiseOrValue<boolean>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides,
    ): Promise<[void]>;

    customFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    daiToken(overrides?: CallOverrides): Promise<[string]>;

    earlyWithdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    earlyWithdrawalFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    firstSegmentStart(overrides?: CallOverrides): Promise<[BigNumber]>;

    getCurrentSegment(overrides?: CallOverrides): Promise<[BigNumber]>;

    getNumberOfPlayers(overrides?: CallOverrides): Promise<[BigNumber]>;

    incentiveController(overrides?: CallOverrides): Promise<[string]>;

    incentiveToken(overrides?: CallOverrides): Promise<[string]>;

    isGameCompleted(overrides?: CallOverrides): Promise<[boolean]>;

    iterablePlayers(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;

    lastSegment(overrides?: CallOverrides): Promise<[BigNumber]>;

    lendingPool(overrides?: CallOverrides): Promise<[string]>;

    lendingPoolAddressProvider(overrides?: CallOverrides): Promise<[string]>;

    makeDeposit(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    matic(overrides?: CallOverrides): Promise<[string]>;

    maxPlayersCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    merkleRoot(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pause(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    players(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [string, boolean, boolean, BigNumber, BigNumber] & {
        addr: string;
        withdrawn: boolean;
        canRejoin: boolean;
        mostRecentSegmentPaid: BigNumber;
        amountPaid: BigNumber;
      }
    >;

    redeemFromExternalPool(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    redeemed(overrides?: CallOverrides): Promise<[boolean]>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    rewardsPerPlayer(overrides?: CallOverrides): Promise<[BigNumber]>;

    segmentLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    segmentPayment(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalGameInterest(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalGamePrincipal(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalIncentiveAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    unpause(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    winners(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;

    withdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    joinGame(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    joinWhitelistedGame(
      index: PromiseOrValue<BigNumberish>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;
  };

  activePlayersCount(overrides?: CallOverrides): Promise<BigNumber>;

  adaiToken(overrides?: CallOverrides): Promise<string>;

  adminFeeAmount(overrides?: CallOverrides): Promise<BigNumber>;

  adminFeeWithdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  adminWithdraw(overrides?: CallOverrides): Promise<boolean>;

  claim(
    index: PromiseOrValue<BigNumberish>,
    account: PromiseOrValue<string>,
    isValid: PromiseOrValue<boolean>,
    merkleProof: PromiseOrValue<BytesLike>[],
    overrides?: CallOverrides,
  ): Promise<void>;

  customFee(overrides?: CallOverrides): Promise<BigNumber>;

  daiToken(overrides?: CallOverrides): Promise<string>;

  earlyWithdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  earlyWithdrawalFee(overrides?: CallOverrides): Promise<BigNumber>;

  firstSegmentStart(overrides?: CallOverrides): Promise<BigNumber>;

  getCurrentSegment(overrides?: CallOverrides): Promise<BigNumber>;

  getNumberOfPlayers(overrides?: CallOverrides): Promise<BigNumber>;

  incentiveController(overrides?: CallOverrides): Promise<string>;

  incentiveToken(overrides?: CallOverrides): Promise<string>;

  isGameCompleted(overrides?: CallOverrides): Promise<boolean>;

  iterablePlayers(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;

  lastSegment(overrides?: CallOverrides): Promise<BigNumber>;

  lendingPool(overrides?: CallOverrides): Promise<string>;

  lendingPoolAddressProvider(overrides?: CallOverrides): Promise<string>;

  makeDeposit(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  matic(overrides?: CallOverrides): Promise<string>;

  maxPlayersCount(overrides?: CallOverrides): Promise<BigNumber>;

  merkleRoot(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  pause(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  players(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<
    [string, boolean, boolean, BigNumber, BigNumber] & {
      addr: string;
      withdrawn: boolean;
      canRejoin: boolean;
      mostRecentSegmentPaid: BigNumber;
      amountPaid: BigNumber;
    }
  >;

  redeemFromExternalPool(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  redeemed(overrides?: CallOverrides): Promise<boolean>;

  renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  rewardsPerPlayer(overrides?: CallOverrides): Promise<BigNumber>;

  segmentLength(overrides?: CallOverrides): Promise<BigNumber>;

  segmentPayment(overrides?: CallOverrides): Promise<BigNumber>;

  totalGameInterest(overrides?: CallOverrides): Promise<BigNumber>;

  totalGamePrincipal(overrides?: CallOverrides): Promise<BigNumber>;

  totalIncentiveAmount(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  unpause(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  winners(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;

  withdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  joinGame(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  joinWhitelistedGame(
    index: PromiseOrValue<BigNumberish>,
    merkleProof: PromiseOrValue<BytesLike>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    activePlayersCount(overrides?: CallOverrides): Promise<BigNumber>;

    adaiToken(overrides?: CallOverrides): Promise<string>;

    adminFeeAmount(overrides?: CallOverrides): Promise<BigNumber>;

    adminFeeWithdraw(overrides?: CallOverrides): Promise<void>;

    adminWithdraw(overrides?: CallOverrides): Promise<boolean>;

    claim(
      index: PromiseOrValue<BigNumberish>,
      account: PromiseOrValue<string>,
      isValid: PromiseOrValue<boolean>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides,
    ): Promise<void>;

    customFee(overrides?: CallOverrides): Promise<BigNumber>;

    daiToken(overrides?: CallOverrides): Promise<string>;

    earlyWithdraw(overrides?: CallOverrides): Promise<void>;

    earlyWithdrawalFee(overrides?: CallOverrides): Promise<BigNumber>;

    firstSegmentStart(overrides?: CallOverrides): Promise<BigNumber>;

    getCurrentSegment(overrides?: CallOverrides): Promise<BigNumber>;

    getNumberOfPlayers(overrides?: CallOverrides): Promise<BigNumber>;

    incentiveController(overrides?: CallOverrides): Promise<string>;

    incentiveToken(overrides?: CallOverrides): Promise<string>;

    isGameCompleted(overrides?: CallOverrides): Promise<boolean>;

    iterablePlayers(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;

    lastSegment(overrides?: CallOverrides): Promise<BigNumber>;

    lendingPool(overrides?: CallOverrides): Promise<string>;

    lendingPoolAddressProvider(overrides?: CallOverrides): Promise<string>;

    makeDeposit(overrides?: CallOverrides): Promise<void>;

    matic(overrides?: CallOverrides): Promise<string>;

    maxPlayersCount(overrides?: CallOverrides): Promise<BigNumber>;

    merkleRoot(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    players(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [string, boolean, boolean, BigNumber, BigNumber] & {
        addr: string;
        withdrawn: boolean;
        canRejoin: boolean;
        mostRecentSegmentPaid: BigNumber;
        amountPaid: BigNumber;
      }
    >;

    redeemFromExternalPool(overrides?: CallOverrides): Promise<void>;

    redeemed(overrides?: CallOverrides): Promise<boolean>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardsPerPlayer(overrides?: CallOverrides): Promise<BigNumber>;

    segmentLength(overrides?: CallOverrides): Promise<BigNumber>;

    segmentPayment(overrides?: CallOverrides): Promise<BigNumber>;

    totalGameInterest(overrides?: CallOverrides): Promise<BigNumber>;

    totalGamePrincipal(overrides?: CallOverrides): Promise<BigNumber>;

    totalIncentiveAmount(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    unpause(overrides?: CallOverrides): Promise<void>;

    winners(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;

    withdraw(overrides?: CallOverrides): Promise<void>;

    joinGame(overrides?: CallOverrides): Promise<void>;

    joinWhitelistedGame(
      index: PromiseOrValue<BigNumberish>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides,
    ): Promise<void>;
  };

  filters: {
    'AdminWithdrawal(address,uint256,uint256,uint256)'(
      admin?: PromiseOrValue<string> | null,
      totalGameInterest?: null,
      adminFeeAmount?: null,
      adminIncentiveAmount?: null,
    ): AdminWithdrawalEventFilter;
    AdminWithdrawal(
      admin?: PromiseOrValue<string> | null,
      totalGameInterest?: null,
      adminFeeAmount?: null,
      adminIncentiveAmount?: null,
    ): AdminWithdrawalEventFilter;

    'Deposit(address,uint256,uint256)'(
      player?: PromiseOrValue<string> | null,
      segment?: PromiseOrValue<BigNumberish> | null,
      amount?: null,
    ): DepositEventFilter;
    Deposit(
      player?: PromiseOrValue<string> | null,
      segment?: PromiseOrValue<BigNumberish> | null,
      amount?: null,
    ): DepositEventFilter;

    'EarlyWithdrawal(address,uint256,uint256)'(
      player?: PromiseOrValue<string> | null,
      amount?: null,
      totalGamePrincipal?: null,
    ): EarlyWithdrawalEventFilter;
    EarlyWithdrawal(
      player?: PromiseOrValue<string> | null,
      amount?: null,
      totalGamePrincipal?: null,
    ): EarlyWithdrawalEventFilter;

    'FundsRedeemedFromExternalPool(uint256,uint256,uint256,uint256,uint256)'(
      totalAmount?: null,
      totalGamePrincipal?: null,
      totalGameInterest?: null,
      rewards?: null,
      totalIncentiveAmount?: null,
    ): FundsRedeemedFromExternalPoolEventFilter;
    FundsRedeemedFromExternalPool(
      totalAmount?: null,
      totalGamePrincipal?: null,
      totalGameInterest?: null,
      rewards?: null,
      totalIncentiveAmount?: null,
    ): FundsRedeemedFromExternalPoolEventFilter;

    'JoinedGame(address,uint256)'(player?: PromiseOrValue<string> | null, amount?: null): JoinedGameEventFilter;
    JoinedGame(player?: PromiseOrValue<string> | null, amount?: null): JoinedGameEventFilter;

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

    'WinnersAnnouncement(address[])'(winners?: null): WinnersAnnouncementEventFilter;
    WinnersAnnouncement(winners?: null): WinnersAnnouncementEventFilter;

    'Withdrawal(address,uint256,uint256,uint256)'(
      player?: PromiseOrValue<string> | null,
      amount?: null,
      playerReward?: null,
      playerIncentive?: null,
    ): WithdrawalEventFilter;
    Withdrawal(
      player?: PromiseOrValue<string> | null,
      amount?: null,
      playerReward?: null,
      playerIncentive?: null,
    ): WithdrawalEventFilter;
  };

  estimateGas: {
    activePlayersCount(overrides?: CallOverrides): Promise<BigNumber>;

    adaiToken(overrides?: CallOverrides): Promise<BigNumber>;

    adminFeeAmount(overrides?: CallOverrides): Promise<BigNumber>;

    adminFeeWithdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    adminWithdraw(overrides?: CallOverrides): Promise<BigNumber>;

    claim(
      index: PromiseOrValue<BigNumberish>,
      account: PromiseOrValue<string>,
      isValid: PromiseOrValue<boolean>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    customFee(overrides?: CallOverrides): Promise<BigNumber>;

    daiToken(overrides?: CallOverrides): Promise<BigNumber>;

    earlyWithdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    earlyWithdrawalFee(overrides?: CallOverrides): Promise<BigNumber>;

    firstSegmentStart(overrides?: CallOverrides): Promise<BigNumber>;

    getCurrentSegment(overrides?: CallOverrides): Promise<BigNumber>;

    getNumberOfPlayers(overrides?: CallOverrides): Promise<BigNumber>;

    incentiveController(overrides?: CallOverrides): Promise<BigNumber>;

    incentiveToken(overrides?: CallOverrides): Promise<BigNumber>;

    isGameCompleted(overrides?: CallOverrides): Promise<BigNumber>;

    iterablePlayers(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    lastSegment(overrides?: CallOverrides): Promise<BigNumber>;

    lendingPool(overrides?: CallOverrides): Promise<BigNumber>;

    lendingPoolAddressProvider(overrides?: CallOverrides): Promise<BigNumber>;

    makeDeposit(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    matic(overrides?: CallOverrides): Promise<BigNumber>;

    maxPlayersCount(overrides?: CallOverrides): Promise<BigNumber>;

    merkleRoot(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pause(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    players(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    redeemFromExternalPool(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    redeemed(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    rewardsPerPlayer(overrides?: CallOverrides): Promise<BigNumber>;

    segmentLength(overrides?: CallOverrides): Promise<BigNumber>;

    segmentPayment(overrides?: CallOverrides): Promise<BigNumber>;

    totalGameInterest(overrides?: CallOverrides): Promise<BigNumber>;

    totalGamePrincipal(overrides?: CallOverrides): Promise<BigNumber>;

    totalIncentiveAmount(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    unpause(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    winners(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    joinGame(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    joinWhitelistedGame(
      index: PromiseOrValue<BigNumberish>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    activePlayersCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    adaiToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    adminFeeAmount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    adminFeeWithdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    adminWithdraw(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claim(
      index: PromiseOrValue<BigNumberish>,
      account: PromiseOrValue<string>,
      isValid: PromiseOrValue<boolean>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    customFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    daiToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    earlyWithdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    earlyWithdrawalFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    firstSegmentStart(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getCurrentSegment(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getNumberOfPlayers(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    incentiveController(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    incentiveToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isGameCompleted(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    iterablePlayers(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lastSegment(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lendingPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lendingPoolAddressProvider(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    makeDeposit(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    matic(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxPlayersCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    merkleRoot(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pause(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    players(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    redeemFromExternalPool(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    redeemed(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    rewardsPerPlayer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    segmentLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    segmentPayment(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalGameInterest(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalGamePrincipal(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalIncentiveAmount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    unpause(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    winners(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    joinGame(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    joinWhitelistedGame(
      index: PromiseOrValue<BigNumberish>,
      merkleProof: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;
  };
}