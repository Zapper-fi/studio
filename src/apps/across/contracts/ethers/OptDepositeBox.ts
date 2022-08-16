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

export interface OptDepositeBoxInterface extends utils.Interface {
  functions: {
    'bridgeTokens(address,uint32)': FunctionFragment;
    'canBridge(address)': FunctionFragment;
    'chainId()': FunctionFragment;
    'crossDomainAdmin()': FunctionFragment;
    'deposit(address,address,uint256,uint64,uint64,uint64)': FunctionFragment;
    'getCurrentTime()': FunctionFragment;
    'isWhitelistToken(address)': FunctionFragment;
    'l1EthWrapper()': FunctionFragment;
    'l1Weth()': FunctionFragment;
    'l2Eth()': FunctionFragment;
    'messenger()': FunctionFragment;
    'minimumBridgingDelay()': FunctionFragment;
    'numberOfDeposits()': FunctionFragment;
    'setCrossDomainAdmin(address)': FunctionFragment;
    'setCurrentTime(uint256)': FunctionFragment;
    'setEnableDeposits(address,bool)': FunctionFragment;
    'setMinimumBridgingDelay(uint64)': FunctionFragment;
    'timerAddress()': FunctionFragment;
    'whitelistToken(address,address,address)': FunctionFragment;
    'whitelistedTokens(address)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'bridgeTokens'
      | 'canBridge'
      | 'chainId'
      | 'crossDomainAdmin'
      | 'deposit'
      | 'getCurrentTime'
      | 'isWhitelistToken'
      | 'l1EthWrapper'
      | 'l1Weth'
      | 'l2Eth'
      | 'messenger'
      | 'minimumBridgingDelay'
      | 'numberOfDeposits'
      | 'setCrossDomainAdmin'
      | 'setCurrentTime'
      | 'setEnableDeposits'
      | 'setMinimumBridgingDelay'
      | 'timerAddress'
      | 'whitelistToken'
      | 'whitelistedTokens',
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: 'bridgeTokens',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(functionFragment: 'canBridge', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'chainId', values?: undefined): string;
  encodeFunctionData(functionFragment: 'crossDomainAdmin', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'deposit',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
    ],
  ): string;
  encodeFunctionData(functionFragment: 'getCurrentTime', values?: undefined): string;
  encodeFunctionData(functionFragment: 'isWhitelistToken', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'l1EthWrapper', values?: undefined): string;
  encodeFunctionData(functionFragment: 'l1Weth', values?: undefined): string;
  encodeFunctionData(functionFragment: 'l2Eth', values?: undefined): string;
  encodeFunctionData(functionFragment: 'messenger', values?: undefined): string;
  encodeFunctionData(functionFragment: 'minimumBridgingDelay', values?: undefined): string;
  encodeFunctionData(functionFragment: 'numberOfDeposits', values?: undefined): string;
  encodeFunctionData(functionFragment: 'setCrossDomainAdmin', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'setCurrentTime', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(
    functionFragment: 'setEnableDeposits',
    values: [PromiseOrValue<string>, PromiseOrValue<boolean>],
  ): string;
  encodeFunctionData(functionFragment: 'setMinimumBridgingDelay', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'timerAddress', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'whitelistToken',
    values: [PromiseOrValue<string>, PromiseOrValue<string>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(functionFragment: 'whitelistedTokens', values: [PromiseOrValue<string>]): string;

  decodeFunctionResult(functionFragment: 'bridgeTokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'canBridge', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'chainId', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'crossDomainAdmin', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getCurrentTime', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'isWhitelistToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'l1EthWrapper', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'l1Weth', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'l2Eth', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'messenger', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'minimumBridgingDelay', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'numberOfDeposits', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setCrossDomainAdmin', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setCurrentTime', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setEnableDeposits', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setMinimumBridgingDelay', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'timerAddress', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'whitelistToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'whitelistedTokens', data: BytesLike): Result;

  events: {
    'DepositsEnabled(address,bool)': EventFragment;
    'FundsDeposited(uint256,uint256,address,address,address,address,uint256,uint64,uint64,uint64)': EventFragment;
    'SetMinimumBridgingDelay(uint64)': EventFragment;
    'SetXDomainAdmin(address)': EventFragment;
    'TokensBridged(address,uint256,uint256,address)': EventFragment;
    'WhitelistToken(address,address,uint64,address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'DepositsEnabled'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'FundsDeposited'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'SetMinimumBridgingDelay'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'SetXDomainAdmin'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'TokensBridged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'WhitelistToken'): EventFragment;
}

export interface DepositsEnabledEventObject {
  l2Token: string;
  depositsEnabled: boolean;
}
export type DepositsEnabledEvent = TypedEvent<[string, boolean], DepositsEnabledEventObject>;

export type DepositsEnabledEventFilter = TypedEventFilter<DepositsEnabledEvent>;

export interface FundsDepositedEventObject {
  chainId: BigNumber;
  depositId: BigNumber;
  l1Recipient: string;
  l2Sender: string;
  l1Token: string;
  l2Token: string;
  amount: BigNumber;
  slowRelayFeePct: BigNumber;
  instantRelayFeePct: BigNumber;
  quoteTimestamp: BigNumber;
}
export type FundsDepositedEvent = TypedEvent<
  [BigNumber, BigNumber, string, string, string, string, BigNumber, BigNumber, BigNumber, BigNumber],
  FundsDepositedEventObject
>;

export type FundsDepositedEventFilter = TypedEventFilter<FundsDepositedEvent>;

export interface SetMinimumBridgingDelayEventObject {
  newMinimumBridgingDelay: BigNumber;
}
export type SetMinimumBridgingDelayEvent = TypedEvent<[BigNumber], SetMinimumBridgingDelayEventObject>;

export type SetMinimumBridgingDelayEventFilter = TypedEventFilter<SetMinimumBridgingDelayEvent>;

export interface SetXDomainAdminEventObject {
  newAdmin: string;
}
export type SetXDomainAdminEvent = TypedEvent<[string], SetXDomainAdminEventObject>;

export type SetXDomainAdminEventFilter = TypedEventFilter<SetXDomainAdminEvent>;

export interface TokensBridgedEventObject {
  l2Token: string;
  numberOfTokensBridged: BigNumber;
  l1Gas: BigNumber;
  caller: string;
}
export type TokensBridgedEvent = TypedEvent<[string, BigNumber, BigNumber, string], TokensBridgedEventObject>;

export type TokensBridgedEventFilter = TypedEventFilter<TokensBridgedEvent>;

export interface WhitelistTokenEventObject {
  l1Token: string;
  l2Token: string;
  lastBridgeTime: BigNumber;
  bridgePool: string;
}
export type WhitelistTokenEvent = TypedEvent<[string, string, BigNumber, string], WhitelistTokenEventObject>;

export type WhitelistTokenEventFilter = TypedEventFilter<WhitelistTokenEvent>;

export interface OptDepositeBox extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OptDepositeBoxInterface;

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
    bridgeTokens(
      l2Token: PromiseOrValue<string>,
      l1Gas: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    canBridge(l2Token: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;

    chainId(overrides?: CallOverrides): Promise<[BigNumber]>;

    crossDomainAdmin(overrides?: CallOverrides): Promise<[string]>;

    deposit(
      l1Recipient: PromiseOrValue<string>,
      l2Token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      slowRelayFeePct: PromiseOrValue<BigNumberish>,
      instantRelayFeePct: PromiseOrValue<BigNumberish>,
      quoteTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    getCurrentTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    isWhitelistToken(l2Token: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;

    l1EthWrapper(overrides?: CallOverrides): Promise<[string]>;

    l1Weth(overrides?: CallOverrides): Promise<[string]>;

    l2Eth(overrides?: CallOverrides): Promise<[string]>;

    messenger(overrides?: CallOverrides): Promise<[string]>;

    minimumBridgingDelay(overrides?: CallOverrides): Promise<[BigNumber]>;

    numberOfDeposits(overrides?: CallOverrides): Promise<[BigNumber]>;

    setCrossDomainAdmin(
      newCrossDomainAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setCurrentTime(
      time: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setEnableDeposits(
      l2Token: PromiseOrValue<string>,
      depositsEnabled: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setMinimumBridgingDelay(
      newMinimumBridgingDelay: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    timerAddress(overrides?: CallOverrides): Promise<[string]>;

    whitelistToken(
      l1Token: PromiseOrValue<string>,
      l2Token: PromiseOrValue<string>,
      l1BridgePool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    whitelistedTokens(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [string, string, BigNumber, boolean] & {
        l1Token: string;
        l1BridgePool: string;
        lastBridgeTime: BigNumber;
        depositsEnabled: boolean;
      }
    >;
  };

  bridgeTokens(
    l2Token: PromiseOrValue<string>,
    l1Gas: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  canBridge(l2Token: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;

  chainId(overrides?: CallOverrides): Promise<BigNumber>;

  crossDomainAdmin(overrides?: CallOverrides): Promise<string>;

  deposit(
    l1Recipient: PromiseOrValue<string>,
    l2Token: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    slowRelayFeePct: PromiseOrValue<BigNumberish>,
    instantRelayFeePct: PromiseOrValue<BigNumberish>,
    quoteTimestamp: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  getCurrentTime(overrides?: CallOverrides): Promise<BigNumber>;

  isWhitelistToken(l2Token: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;

  l1EthWrapper(overrides?: CallOverrides): Promise<string>;

  l1Weth(overrides?: CallOverrides): Promise<string>;

  l2Eth(overrides?: CallOverrides): Promise<string>;

  messenger(overrides?: CallOverrides): Promise<string>;

  minimumBridgingDelay(overrides?: CallOverrides): Promise<BigNumber>;

  numberOfDeposits(overrides?: CallOverrides): Promise<BigNumber>;

  setCrossDomainAdmin(
    newCrossDomainAdmin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setCurrentTime(
    time: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setEnableDeposits(
    l2Token: PromiseOrValue<string>,
    depositsEnabled: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setMinimumBridgingDelay(
    newMinimumBridgingDelay: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  timerAddress(overrides?: CallOverrides): Promise<string>;

  whitelistToken(
    l1Token: PromiseOrValue<string>,
    l2Token: PromiseOrValue<string>,
    l1BridgePool: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  whitelistedTokens(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<
    [string, string, BigNumber, boolean] & {
      l1Token: string;
      l1BridgePool: string;
      lastBridgeTime: BigNumber;
      depositsEnabled: boolean;
    }
  >;

  callStatic: {
    bridgeTokens(
      l2Token: PromiseOrValue<string>,
      l1Gas: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    canBridge(l2Token: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;

    chainId(overrides?: CallOverrides): Promise<BigNumber>;

    crossDomainAdmin(overrides?: CallOverrides): Promise<string>;

    deposit(
      l1Recipient: PromiseOrValue<string>,
      l2Token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      slowRelayFeePct: PromiseOrValue<BigNumberish>,
      instantRelayFeePct: PromiseOrValue<BigNumberish>,
      quoteTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    getCurrentTime(overrides?: CallOverrides): Promise<BigNumber>;

    isWhitelistToken(l2Token: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;

    l1EthWrapper(overrides?: CallOverrides): Promise<string>;

    l1Weth(overrides?: CallOverrides): Promise<string>;

    l2Eth(overrides?: CallOverrides): Promise<string>;

    messenger(overrides?: CallOverrides): Promise<string>;

    minimumBridgingDelay(overrides?: CallOverrides): Promise<BigNumber>;

    numberOfDeposits(overrides?: CallOverrides): Promise<BigNumber>;

    setCrossDomainAdmin(newCrossDomainAdmin: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    setCurrentTime(time: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;

    setEnableDeposits(
      l2Token: PromiseOrValue<string>,
      depositsEnabled: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<void>;

    setMinimumBridgingDelay(
      newMinimumBridgingDelay: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    timerAddress(overrides?: CallOverrides): Promise<string>;

    whitelistToken(
      l1Token: PromiseOrValue<string>,
      l2Token: PromiseOrValue<string>,
      l1BridgePool: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<void>;

    whitelistedTokens(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [string, string, BigNumber, boolean] & {
        l1Token: string;
        l1BridgePool: string;
        lastBridgeTime: BigNumber;
        depositsEnabled: boolean;
      }
    >;
  };

  filters: {
    'DepositsEnabled(address,bool)'(l2Token?: null, depositsEnabled?: null): DepositsEnabledEventFilter;
    DepositsEnabled(l2Token?: null, depositsEnabled?: null): DepositsEnabledEventFilter;

    'FundsDeposited(uint256,uint256,address,address,address,address,uint256,uint64,uint64,uint64)'(
      chainId?: null,
      depositId?: null,
      l1Recipient?: null,
      l2Sender?: null,
      l1Token?: null,
      l2Token?: null,
      amount?: null,
      slowRelayFeePct?: null,
      instantRelayFeePct?: null,
      quoteTimestamp?: null,
    ): FundsDepositedEventFilter;
    FundsDeposited(
      chainId?: null,
      depositId?: null,
      l1Recipient?: null,
      l2Sender?: null,
      l1Token?: null,
      l2Token?: null,
      amount?: null,
      slowRelayFeePct?: null,
      instantRelayFeePct?: null,
      quoteTimestamp?: null,
    ): FundsDepositedEventFilter;

    'SetMinimumBridgingDelay(uint64)'(newMinimumBridgingDelay?: null): SetMinimumBridgingDelayEventFilter;
    SetMinimumBridgingDelay(newMinimumBridgingDelay?: null): SetMinimumBridgingDelayEventFilter;

    'SetXDomainAdmin(address)'(newAdmin?: PromiseOrValue<string> | null): SetXDomainAdminEventFilter;
    SetXDomainAdmin(newAdmin?: PromiseOrValue<string> | null): SetXDomainAdminEventFilter;

    'TokensBridged(address,uint256,uint256,address)'(
      l2Token?: PromiseOrValue<string> | null,
      numberOfTokensBridged?: null,
      l1Gas?: null,
      caller?: PromiseOrValue<string> | null,
    ): TokensBridgedEventFilter;
    TokensBridged(
      l2Token?: PromiseOrValue<string> | null,
      numberOfTokensBridged?: null,
      l1Gas?: null,
      caller?: PromiseOrValue<string> | null,
    ): TokensBridgedEventFilter;

    'WhitelistToken(address,address,uint64,address)'(
      l1Token?: null,
      l2Token?: null,
      lastBridgeTime?: null,
      bridgePool?: null,
    ): WhitelistTokenEventFilter;
    WhitelistToken(l1Token?: null, l2Token?: null, lastBridgeTime?: null, bridgePool?: null): WhitelistTokenEventFilter;
  };

  estimateGas: {
    bridgeTokens(
      l2Token: PromiseOrValue<string>,
      l1Gas: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    canBridge(l2Token: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    chainId(overrides?: CallOverrides): Promise<BigNumber>;

    crossDomainAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      l1Recipient: PromiseOrValue<string>,
      l2Token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      slowRelayFeePct: PromiseOrValue<BigNumberish>,
      instantRelayFeePct: PromiseOrValue<BigNumberish>,
      quoteTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    getCurrentTime(overrides?: CallOverrides): Promise<BigNumber>;

    isWhitelistToken(l2Token: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    l1EthWrapper(overrides?: CallOverrides): Promise<BigNumber>;

    l1Weth(overrides?: CallOverrides): Promise<BigNumber>;

    l2Eth(overrides?: CallOverrides): Promise<BigNumber>;

    messenger(overrides?: CallOverrides): Promise<BigNumber>;

    minimumBridgingDelay(overrides?: CallOverrides): Promise<BigNumber>;

    numberOfDeposits(overrides?: CallOverrides): Promise<BigNumber>;

    setCrossDomainAdmin(
      newCrossDomainAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setCurrentTime(
      time: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setEnableDeposits(
      l2Token: PromiseOrValue<string>,
      depositsEnabled: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setMinimumBridgingDelay(
      newMinimumBridgingDelay: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    timerAddress(overrides?: CallOverrides): Promise<BigNumber>;

    whitelistToken(
      l1Token: PromiseOrValue<string>,
      l2Token: PromiseOrValue<string>,
      l1BridgePool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    whitelistedTokens(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    bridgeTokens(
      l2Token: PromiseOrValue<string>,
      l1Gas: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    canBridge(l2Token: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    chainId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    crossDomainAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      l1Recipient: PromiseOrValue<string>,
      l2Token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      slowRelayFeePct: PromiseOrValue<BigNumberish>,
      instantRelayFeePct: PromiseOrValue<BigNumberish>,
      quoteTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    getCurrentTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isWhitelistToken(l2Token: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    l1EthWrapper(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    l1Weth(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    l2Eth(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    messenger(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    minimumBridgingDelay(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    numberOfDeposits(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setCrossDomainAdmin(
      newCrossDomainAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setCurrentTime(
      time: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setEnableDeposits(
      l2Token: PromiseOrValue<string>,
      depositsEnabled: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setMinimumBridgingDelay(
      newMinimumBridgingDelay: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    timerAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    whitelistToken(
      l1Token: PromiseOrValue<string>,
      l2Token: PromiseOrValue<string>,
      l1BridgePool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    whitelistedTokens(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
