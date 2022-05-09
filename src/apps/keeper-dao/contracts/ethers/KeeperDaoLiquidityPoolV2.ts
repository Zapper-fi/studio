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
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common';

export interface KeeperDaoLiquidityPoolV2Interface extends utils.Interface {
  functions: {
    'ETHEREUM()': FunctionFragment;
    'FEE_BASE()': FunctionFragment;
    'VERSION()': FunctionFragment;
    'addOperator(address)': FunctionFragment;
    'addPauser(address)': FunctionFragment;
    'blacklistRecoverableToken(address)': FunctionFragment;
    'borrow(address,uint256,bytes)': FunctionFragment;
    'borrowableBalance(address)': FunctionFragment;
    'deposit(address,uint256)': FunctionFragment;
    'depositFeeInBips()': FunctionFragment;
    'initialize(string,address)': FunctionFragment;
    'initialize()': FunctionFragment;
    'initialize(address)': FunctionFragment;
    'isOperator(address)': FunctionFragment;
    'isPauser(address)': FunctionFragment;
    'kToken(address)': FunctionFragment;
    'kTokens(address)': FunctionFragment;
    'migrate(address)': FunctionFragment;
    'operators(uint256)': FunctionFragment;
    'pause()': FunctionFragment;
    'paused()': FunctionFragment;
    'poolFeeInBips()': FunctionFragment;
    'recoverTokens(address)': FunctionFragment;
    'register(address)': FunctionFragment;
    'registeredKTokens(address)': FunctionFragment;
    'registeredTokens(uint256)': FunctionFragment;
    'renounceOperator()': FunctionFragment;
    'renouncePauser()': FunctionFragment;
    'underlyingBalance(address,address)': FunctionFragment;
    'unpause()': FunctionFragment;
    'updateDepositFee(uint256)': FunctionFragment;
    'updateFeePool(address)': FunctionFragment;
    'updatePoolFee(uint256)': FunctionFragment;
    'withdraw(address,address,uint256)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'ETHEREUM'
      | 'FEE_BASE'
      | 'VERSION'
      | 'addOperator'
      | 'addPauser'
      | 'blacklistRecoverableToken'
      | 'borrow'
      | 'borrowableBalance'
      | 'deposit'
      | 'depositFeeInBips'
      | 'initialize(string,address)'
      | 'initialize()'
      | 'initialize(address)'
      | 'isOperator'
      | 'isPauser'
      | 'kToken'
      | 'kTokens'
      | 'migrate'
      | 'operators'
      | 'pause'
      | 'paused'
      | 'poolFeeInBips'
      | 'recoverTokens'
      | 'register'
      | 'registeredKTokens'
      | 'registeredTokens'
      | 'renounceOperator'
      | 'renouncePauser'
      | 'underlyingBalance'
      | 'unpause'
      | 'updateDepositFee'
      | 'updateFeePool'
      | 'updatePoolFee'
      | 'withdraw',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'ETHEREUM', values?: undefined): string;
  encodeFunctionData(functionFragment: 'FEE_BASE', values?: undefined): string;
  encodeFunctionData(functionFragment: 'VERSION', values?: undefined): string;
  encodeFunctionData(functionFragment: 'addOperator', values: [string]): string;
  encodeFunctionData(functionFragment: 'addPauser', values: [string]): string;
  encodeFunctionData(functionFragment: 'blacklistRecoverableToken', values: [string]): string;
  encodeFunctionData(functionFragment: 'borrow', values: [string, BigNumberish, BytesLike]): string;
  encodeFunctionData(functionFragment: 'borrowableBalance', values: [string]): string;
  encodeFunctionData(functionFragment: 'deposit', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'depositFeeInBips', values?: undefined): string;
  encodeFunctionData(functionFragment: 'initialize(string,address)', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'initialize()', values?: undefined): string;
  encodeFunctionData(functionFragment: 'initialize(address)', values: [string]): string;
  encodeFunctionData(functionFragment: 'isOperator', values: [string]): string;
  encodeFunctionData(functionFragment: 'isPauser', values: [string]): string;
  encodeFunctionData(functionFragment: 'kToken', values: [string]): string;
  encodeFunctionData(functionFragment: 'kTokens', values: [string]): string;
  encodeFunctionData(functionFragment: 'migrate', values: [string]): string;
  encodeFunctionData(functionFragment: 'operators', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'pause', values?: undefined): string;
  encodeFunctionData(functionFragment: 'paused', values?: undefined): string;
  encodeFunctionData(functionFragment: 'poolFeeInBips', values?: undefined): string;
  encodeFunctionData(functionFragment: 'recoverTokens', values: [string]): string;
  encodeFunctionData(functionFragment: 'register', values: [string]): string;
  encodeFunctionData(functionFragment: 'registeredKTokens', values: [string]): string;
  encodeFunctionData(functionFragment: 'registeredTokens', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'renounceOperator', values?: undefined): string;
  encodeFunctionData(functionFragment: 'renouncePauser', values?: undefined): string;
  encodeFunctionData(functionFragment: 'underlyingBalance', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'unpause', values?: undefined): string;
  encodeFunctionData(functionFragment: 'updateDepositFee', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'updateFeePool', values: [string]): string;
  encodeFunctionData(functionFragment: 'updatePoolFee', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'withdraw', values: [string, string, BigNumberish]): string;

  decodeFunctionResult(functionFragment: 'ETHEREUM', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'FEE_BASE', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'VERSION', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'addOperator', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'addPauser', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'blacklistRecoverableToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'borrow', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'borrowableBalance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'depositFeeInBips', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'initialize(string,address)', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'initialize()', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'initialize(address)', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'isOperator', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'isPauser', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'kToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'kTokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'migrate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'operators', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pause', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'paused', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poolFeeInBips', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'recoverTokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'register', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'registeredKTokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'registeredTokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOperator', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renouncePauser', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'underlyingBalance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'unpause', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updateDepositFee', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updateFeePool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'updatePoolFee', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;

  events: {
    'Borrowed(address,address,uint256,uint256)': EventFragment;
    'Deposited(address,address,uint256,uint256)': EventFragment;
    'EtherReceived(address,uint256)': EventFragment;
    'OperatorAdded(address)': EventFragment;
    'OperatorRemoved(address)': EventFragment;
    'Paused(address)': EventFragment;
    'PauserAdded(address)': EventFragment;
    'PauserRemoved(address)': EventFragment;
    'Unpaused(address)': EventFragment;
    'Withdrew(address,address,address,uint256,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Borrowed'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Deposited'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'EtherReceived'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OperatorAdded'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OperatorRemoved'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Paused'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'PauserAdded'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'PauserRemoved'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Unpaused'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdrew'): EventFragment;
}

export interface BorrowedEventObject {
  _borrower: string;
  _token: string;
  _amount: BigNumber;
  _fee: BigNumber;
}
export type BorrowedEvent = TypedEvent<[string, string, BigNumber, BigNumber], BorrowedEventObject>;

export type BorrowedEventFilter = TypedEventFilter<BorrowedEvent>;

export interface DepositedEventObject {
  _depositor: string;
  _token: string;
  _amount: BigNumber;
  _mintAmount: BigNumber;
}
export type DepositedEvent = TypedEvent<[string, string, BigNumber, BigNumber], DepositedEventObject>;

export type DepositedEventFilter = TypedEventFilter<DepositedEvent>;

export interface EtherReceivedEventObject {
  _from: string;
  _amount: BigNumber;
}
export type EtherReceivedEvent = TypedEvent<[string, BigNumber], EtherReceivedEventObject>;

export type EtherReceivedEventFilter = TypedEventFilter<EtherReceivedEvent>;

export interface OperatorAddedEventObject {
  account: string;
}
export type OperatorAddedEvent = TypedEvent<[string], OperatorAddedEventObject>;

export type OperatorAddedEventFilter = TypedEventFilter<OperatorAddedEvent>;

export interface OperatorRemovedEventObject {
  account: string;
}
export type OperatorRemovedEvent = TypedEvent<[string], OperatorRemovedEventObject>;

export type OperatorRemovedEventFilter = TypedEventFilter<OperatorRemovedEvent>;

export interface PausedEventObject {
  account: string;
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export interface PauserAddedEventObject {
  account: string;
}
export type PauserAddedEvent = TypedEvent<[string], PauserAddedEventObject>;

export type PauserAddedEventFilter = TypedEventFilter<PauserAddedEvent>;

export interface PauserRemovedEventObject {
  account: string;
}
export type PauserRemovedEvent = TypedEvent<[string], PauserRemovedEventObject>;

export type PauserRemovedEventFilter = TypedEventFilter<PauserRemovedEvent>;

export interface UnpausedEventObject {
  account: string;
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export interface WithdrewEventObject {
  _reciever: string;
  _withdrawer: string;
  _token: string;
  _amount: BigNumber;
  _burnAmount: BigNumber;
}
export type WithdrewEvent = TypedEvent<[string, string, string, BigNumber, BigNumber], WithdrewEventObject>;

export type WithdrewEventFilter = TypedEventFilter<WithdrewEvent>;

export interface KeeperDaoLiquidityPoolV2 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: KeeperDaoLiquidityPoolV2Interface;

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
    ETHEREUM(overrides?: CallOverrides): Promise<[string]>;

    FEE_BASE(overrides?: CallOverrides): Promise<[BigNumber]>;

    VERSION(overrides?: CallOverrides): Promise<[string]>;

    addOperator(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    addPauser(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    blacklistRecoverableToken(
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    borrow(
      _token: string,
      _amount: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    borrowableBalance(_token: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    deposit(
      _token: string,
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    depositFeeInBips(overrides?: CallOverrides): Promise<[BigNumber]>;

    'initialize(string,address)'(
      _VERSION: string,
      _borrower: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    'initialize()'(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    'initialize(address)'(
      sender: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    isOperator(account: string, overrides?: CallOverrides): Promise<[boolean]>;

    isPauser(account: string, overrides?: CallOverrides): Promise<[boolean]>;

    kToken(_token: string, overrides?: CallOverrides): Promise<[string]>;

    kTokens(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    migrate(_newLP: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    operators(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    pause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    poolFeeInBips(overrides?: CallOverrides): Promise<[BigNumber]>;

    recoverTokens(
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    register(
      _kToken: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    registeredKTokens(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    registeredTokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    renounceOperator(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    renouncePauser(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    underlyingBalance(_token: string, _owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    unpause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    updateDepositFee(
      _depositFeeInBips: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    updateFeePool(
      _newFeePool: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    updatePoolFee(
      _poolFeeInBips: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    withdraw(
      _to: string,
      _kToken: string,
      _kTokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;
  };

  ETHEREUM(overrides?: CallOverrides): Promise<string>;

  FEE_BASE(overrides?: CallOverrides): Promise<BigNumber>;

  VERSION(overrides?: CallOverrides): Promise<string>;

  addOperator(
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  addPauser(account: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  blacklistRecoverableToken(
    _token: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  borrow(
    _token: string,
    _amount: BigNumberish,
    _data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  borrowableBalance(_token: string, overrides?: CallOverrides): Promise<BigNumber>;

  deposit(
    _token: string,
    _amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  depositFeeInBips(overrides?: CallOverrides): Promise<BigNumber>;

  'initialize(string,address)'(
    _VERSION: string,
    _borrower: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  'initialize()'(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  'initialize(address)'(
    sender: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  isOperator(account: string, overrides?: CallOverrides): Promise<boolean>;

  isPauser(account: string, overrides?: CallOverrides): Promise<boolean>;

  kToken(_token: string, overrides?: CallOverrides): Promise<string>;

  kTokens(arg0: string, overrides?: CallOverrides): Promise<string>;

  migrate(_newLP: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  operators(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  pause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  poolFeeInBips(overrides?: CallOverrides): Promise<BigNumber>;

  recoverTokens(
    _token: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  register(_kToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  registeredKTokens(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  registeredTokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  renounceOperator(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  renouncePauser(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  underlyingBalance(_token: string, _owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  unpause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  updateDepositFee(
    _depositFeeInBips: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  updateFeePool(
    _newFeePool: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  updatePoolFee(
    _poolFeeInBips: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  withdraw(
    _to: string,
    _kToken: string,
    _kTokenAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    ETHEREUM(overrides?: CallOverrides): Promise<string>;

    FEE_BASE(overrides?: CallOverrides): Promise<BigNumber>;

    VERSION(overrides?: CallOverrides): Promise<string>;

    addOperator(account: string, overrides?: CallOverrides): Promise<void>;

    addPauser(account: string, overrides?: CallOverrides): Promise<void>;

    blacklistRecoverableToken(_token: string, overrides?: CallOverrides): Promise<void>;

    borrow(_token: string, _amount: BigNumberish, _data: BytesLike, overrides?: CallOverrides): Promise<void>;

    borrowableBalance(_token: string, overrides?: CallOverrides): Promise<BigNumber>;

    deposit(_token: string, _amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    depositFeeInBips(overrides?: CallOverrides): Promise<BigNumber>;

    'initialize(string,address)'(_VERSION: string, _borrower: string, overrides?: CallOverrides): Promise<void>;

    'initialize()'(overrides?: CallOverrides): Promise<void>;

    'initialize(address)'(sender: string, overrides?: CallOverrides): Promise<void>;

    isOperator(account: string, overrides?: CallOverrides): Promise<boolean>;

    isPauser(account: string, overrides?: CallOverrides): Promise<boolean>;

    kToken(_token: string, overrides?: CallOverrides): Promise<string>;

    kTokens(arg0: string, overrides?: CallOverrides): Promise<string>;

    migrate(_newLP: string, overrides?: CallOverrides): Promise<void>;

    operators(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    poolFeeInBips(overrides?: CallOverrides): Promise<BigNumber>;

    recoverTokens(_token: string, overrides?: CallOverrides): Promise<void>;

    register(_kToken: string, overrides?: CallOverrides): Promise<void>;

    registeredKTokens(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    registeredTokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    renounceOperator(overrides?: CallOverrides): Promise<void>;

    renouncePauser(overrides?: CallOverrides): Promise<void>;

    underlyingBalance(_token: string, _owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    unpause(overrides?: CallOverrides): Promise<void>;

    updateDepositFee(_depositFeeInBips: BigNumberish, overrides?: CallOverrides): Promise<void>;

    updateFeePool(_newFeePool: string, overrides?: CallOverrides): Promise<void>;

    updatePoolFee(_poolFeeInBips: BigNumberish, overrides?: CallOverrides): Promise<void>;

    withdraw(_to: string, _kToken: string, _kTokenAmount: BigNumberish, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    'Borrowed(address,address,uint256,uint256)'(
      _borrower?: string | null,
      _token?: string | null,
      _amount?: null,
      _fee?: null,
    ): BorrowedEventFilter;
    Borrowed(_borrower?: string | null, _token?: string | null, _amount?: null, _fee?: null): BorrowedEventFilter;

    'Deposited(address,address,uint256,uint256)'(
      _depositor?: string | null,
      _token?: string | null,
      _amount?: null,
      _mintAmount?: null,
    ): DepositedEventFilter;
    Deposited(
      _depositor?: string | null,
      _token?: string | null,
      _amount?: null,
      _mintAmount?: null,
    ): DepositedEventFilter;

    'EtherReceived(address,uint256)'(_from?: string | null, _amount?: null): EtherReceivedEventFilter;
    EtherReceived(_from?: string | null, _amount?: null): EtherReceivedEventFilter;

    'OperatorAdded(address)'(account?: string | null): OperatorAddedEventFilter;
    OperatorAdded(account?: string | null): OperatorAddedEventFilter;

    'OperatorRemoved(address)'(account?: string | null): OperatorRemovedEventFilter;
    OperatorRemoved(account?: string | null): OperatorRemovedEventFilter;

    'Paused(address)'(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    'PauserAdded(address)'(account?: string | null): PauserAddedEventFilter;
    PauserAdded(account?: string | null): PauserAddedEventFilter;

    'PauserRemoved(address)'(account?: string | null): PauserRemovedEventFilter;
    PauserRemoved(account?: string | null): PauserRemovedEventFilter;

    'Unpaused(address)'(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;

    'Withdrew(address,address,address,uint256,uint256)'(
      _reciever?: string | null,
      _withdrawer?: string | null,
      _token?: string | null,
      _amount?: null,
      _burnAmount?: null,
    ): WithdrewEventFilter;
    Withdrew(
      _reciever?: string | null,
      _withdrawer?: string | null,
      _token?: string | null,
      _amount?: null,
      _burnAmount?: null,
    ): WithdrewEventFilter;
  };

  estimateGas: {
    ETHEREUM(overrides?: CallOverrides): Promise<BigNumber>;

    FEE_BASE(overrides?: CallOverrides): Promise<BigNumber>;

    VERSION(overrides?: CallOverrides): Promise<BigNumber>;

    addOperator(account: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    addPauser(account: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    blacklistRecoverableToken(
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    borrow(
      _token: string,
      _amount: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    borrowableBalance(_token: string, overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      _token: string,
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    depositFeeInBips(overrides?: CallOverrides): Promise<BigNumber>;

    'initialize(string,address)'(
      _VERSION: string,
      _borrower: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    'initialize()'(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    'initialize(address)'(
      sender: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    isOperator(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    isPauser(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    kToken(_token: string, overrides?: CallOverrides): Promise<BigNumber>;

    kTokens(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    migrate(_newLP: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    operators(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    pause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    poolFeeInBips(overrides?: CallOverrides): Promise<BigNumber>;

    recoverTokens(_token: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    register(_kToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    registeredKTokens(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    registeredTokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    renounceOperator(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    renouncePauser(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    underlyingBalance(_token: string, _owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    unpause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    updateDepositFee(
      _depositFeeInBips: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    updateFeePool(_newFeePool: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    updatePoolFee(
      _poolFeeInBips: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    withdraw(
      _to: string,
      _kToken: string,
      _kTokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    ETHEREUM(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    FEE_BASE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    VERSION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addOperator(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    addPauser(
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    blacklistRecoverableToken(
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    borrow(
      _token: string,
      _amount: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    borrowableBalance(_token: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      _token: string,
      _amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    depositFeeInBips(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    'initialize(string,address)'(
      _VERSION: string,
      _borrower: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    'initialize()'(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    'initialize(address)'(
      sender: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    isOperator(account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isPauser(account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    kToken(_token: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    kTokens(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    migrate(_newLP: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    operators(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolFeeInBips(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    recoverTokens(
      _token: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    register(
      _kToken: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    registeredKTokens(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    registeredTokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOperator(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    renouncePauser(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    underlyingBalance(_token: string, _owner: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    unpause(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    updateDepositFee(
      _depositFeeInBips: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    updateFeePool(
      _newFeePool: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    updatePoolFee(
      _poolFeeInBips: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    withdraw(
      _to: string,
      _kToken: string,
      _kTokenAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;
  };
}
