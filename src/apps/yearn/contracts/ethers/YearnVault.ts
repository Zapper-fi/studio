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

export interface YearnVaultInterface extends utils.Interface {
  functions: {
    'aToken()': FunctionFragment;
    'aave()': FunctionFragment;
    'allowance(address,address)': FunctionFragment;
    'approve(address,uint256)': FunctionFragment;
    'available()': FunctionFragment;
    'balance()': FunctionFragment;
    'balanceOf(address)': FunctionFragment;
    'balanceUnderlying()': FunctionFragment;
    'decimals()': FunctionFragment;
    'decreaseAllowance(address,uint256)': FunctionFragment;
    'deposit(uint256)': FunctionFragment;
    'depositAll()': FunctionFragment;
    'earn()': FunctionFragment;
    'getAave()': FunctionFragment;
    'getAaveCore()': FunctionFragment;
    'getPricePerFullShare()': FunctionFragment;
    'governance()': FunctionFragment;
    'increaseAllowance(address,uint256)': FunctionFragment;
    'max()': FunctionFragment;
    'min()': FunctionFragment;
    'name()': FunctionFragment;
    'setGovernance(address)': FunctionFragment;
    'setMin(uint256)': FunctionFragment;
    'symbol()': FunctionFragment;
    'token()': FunctionFragment;
    'totalSupply()': FunctionFragment;
    'transfer(address,uint256)': FunctionFragment;
    'transferFrom(address,address,uint256)': FunctionFragment;
    'vault()': FunctionFragment;
    'withdraw(uint256)': FunctionFragment;
    'withdrawAll()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'aToken'
      | 'aave'
      | 'allowance'
      | 'approve'
      | 'available'
      | 'balance'
      | 'balanceOf'
      | 'balanceUnderlying'
      | 'decimals'
      | 'decreaseAllowance'
      | 'deposit'
      | 'depositAll'
      | 'earn'
      | 'getAave'
      | 'getAaveCore'
      | 'getPricePerFullShare'
      | 'governance'
      | 'increaseAllowance'
      | 'max'
      | 'min'
      | 'name'
      | 'setGovernance'
      | 'setMin'
      | 'symbol'
      | 'token'
      | 'totalSupply'
      | 'transfer'
      | 'transferFrom'
      | 'vault'
      | 'withdraw'
      | 'withdrawAll',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'aToken', values?: undefined): string;
  encodeFunctionData(functionFragment: 'aave', values?: undefined): string;
  encodeFunctionData(functionFragment: 'allowance', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'approve', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'available', values?: undefined): string;
  encodeFunctionData(functionFragment: 'balance', values?: undefined): string;
  encodeFunctionData(functionFragment: 'balanceOf', values: [string]): string;
  encodeFunctionData(functionFragment: 'balanceUnderlying', values?: undefined): string;
  encodeFunctionData(functionFragment: 'decimals', values?: undefined): string;
  encodeFunctionData(functionFragment: 'decreaseAllowance', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'deposit', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'depositAll', values?: undefined): string;
  encodeFunctionData(functionFragment: 'earn', values?: undefined): string;
  encodeFunctionData(functionFragment: 'getAave', values?: undefined): string;
  encodeFunctionData(functionFragment: 'getAaveCore', values?: undefined): string;
  encodeFunctionData(functionFragment: 'getPricePerFullShare', values?: undefined): string;
  encodeFunctionData(functionFragment: 'governance', values?: undefined): string;
  encodeFunctionData(functionFragment: 'increaseAllowance', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'max', values?: undefined): string;
  encodeFunctionData(functionFragment: 'min', values?: undefined): string;
  encodeFunctionData(functionFragment: 'name', values?: undefined): string;
  encodeFunctionData(functionFragment: 'setGovernance', values: [string]): string;
  encodeFunctionData(functionFragment: 'setMin', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'symbol', values?: undefined): string;
  encodeFunctionData(functionFragment: 'token', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalSupply', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transfer', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'transferFrom', values: [string, string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'vault', values?: undefined): string;
  encodeFunctionData(functionFragment: 'withdraw', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'withdrawAll', values?: undefined): string;

  decodeFunctionResult(functionFragment: 'aToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'aave', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'allowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'available', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'balance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'balanceUnderlying', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'decimals', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'decreaseAllowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'depositAll', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'earn', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getAave', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getAaveCore', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getPricePerFullShare', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'governance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'increaseAllowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'max', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'min', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setGovernance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setMin', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'token', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transfer', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferFrom', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'vault', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdrawAll', data: BytesLike): Result;

  events: {
    'Approval(address,address,uint256)': EventFragment;
    'Transfer(address,address,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Approval'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Transfer'): EventFragment;
}

export interface ApprovalEventObject {
  owner: string;
  spender: string;
  value: BigNumber;
}
export type ApprovalEvent = TypedEvent<[string, string, BigNumber], ApprovalEventObject>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export interface TransferEventObject {
  from: string;
  to: string;
  value: BigNumber;
}
export type TransferEvent = TypedEvent<[string, string, BigNumber], TransferEventObject>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface YearnVault extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: YearnVaultInterface;

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
    aToken(overrides?: CallOverrides): Promise<[string]>;

    aave(overrides?: CallOverrides): Promise<[string]>;

    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    available(overrides?: CallOverrides): Promise<[BigNumber]>;

    balance(overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceUnderlying(overrides?: CallOverrides): Promise<[BigNumber]>;

    decimals(overrides?: CallOverrides): Promise<[number]>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    deposit(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    depositAll(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    earn(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    getAave(overrides?: CallOverrides): Promise<[string]>;

    getAaveCore(overrides?: CallOverrides): Promise<[string]>;

    getPricePerFullShare(overrides?: CallOverrides): Promise<[BigNumber]>;

    governance(overrides?: CallOverrides): Promise<[string]>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    max(overrides?: CallOverrides): Promise<[BigNumber]>;

    min(overrides?: CallOverrides): Promise<[BigNumber]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    setGovernance(
      _governance: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setMin(
      _min: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    token(overrides?: CallOverrides): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    vault(overrides?: CallOverrides): Promise<[string]>;

    withdraw(
      _shares: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    withdrawAll(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;
  };

  aToken(overrides?: CallOverrides): Promise<string>;

  aave(overrides?: CallOverrides): Promise<string>;

  allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;

  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  available(overrides?: CallOverrides): Promise<BigNumber>;

  balance(overrides?: CallOverrides): Promise<BigNumber>;

  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  balanceUnderlying(overrides?: CallOverrides): Promise<BigNumber>;

  decimals(overrides?: CallOverrides): Promise<number>;

  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  deposit(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  depositAll(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  earn(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  getAave(overrides?: CallOverrides): Promise<string>;

  getAaveCore(overrides?: CallOverrides): Promise<string>;

  getPricePerFullShare(overrides?: CallOverrides): Promise<BigNumber>;

  governance(overrides?: CallOverrides): Promise<string>;

  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  max(overrides?: CallOverrides): Promise<BigNumber>;

  min(overrides?: CallOverrides): Promise<BigNumber>;

  name(overrides?: CallOverrides): Promise<string>;

  setGovernance(
    _governance: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setMin(_min: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  symbol(overrides?: CallOverrides): Promise<string>;

  token(overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  transfer(
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  vault(overrides?: CallOverrides): Promise<string>;

  withdraw(
    _shares: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  withdrawAll(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  callStatic: {
    aToken(overrides?: CallOverrides): Promise<string>;

    aave(overrides?: CallOverrides): Promise<string>;

    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;

    approve(spender: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    available(overrides?: CallOverrides): Promise<BigNumber>;

    balance(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    balanceUnderlying(overrides?: CallOverrides): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<number>;

    decreaseAllowance(spender: string, subtractedValue: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    deposit(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    depositAll(overrides?: CallOverrides): Promise<void>;

    earn(overrides?: CallOverrides): Promise<void>;

    getAave(overrides?: CallOverrides): Promise<string>;

    getAaveCore(overrides?: CallOverrides): Promise<string>;

    getPricePerFullShare(overrides?: CallOverrides): Promise<BigNumber>;

    governance(overrides?: CallOverrides): Promise<string>;

    increaseAllowance(spender: string, addedValue: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    max(overrides?: CallOverrides): Promise<BigNumber>;

    min(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<string>;

    setGovernance(_governance: string, overrides?: CallOverrides): Promise<void>;

    setMin(_min: BigNumberish, overrides?: CallOverrides): Promise<void>;

    symbol(overrides?: CallOverrides): Promise<string>;

    token(overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(recipient: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    transferFrom(sender: string, recipient: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    vault(overrides?: CallOverrides): Promise<string>;

    withdraw(_shares: BigNumberish, overrides?: CallOverrides): Promise<void>;

    withdrawAll(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    'Approval(address,address,uint256)'(
      owner?: string | null,
      spender?: string | null,
      value?: null,
    ): ApprovalEventFilter;
    Approval(owner?: string | null, spender?: string | null, value?: null): ApprovalEventFilter;

    'Transfer(address,address,uint256)'(from?: string | null, to?: string | null, value?: null): TransferEventFilter;
    Transfer(from?: string | null, to?: string | null, value?: null): TransferEventFilter;
  };

  estimateGas: {
    aToken(overrides?: CallOverrides): Promise<BigNumber>;

    aave(overrides?: CallOverrides): Promise<BigNumber>;

    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    available(overrides?: CallOverrides): Promise<BigNumber>;

    balance(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    balanceUnderlying(overrides?: CallOverrides): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    deposit(_amount: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    depositAll(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    earn(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    getAave(overrides?: CallOverrides): Promise<BigNumber>;

    getAaveCore(overrides?: CallOverrides): Promise<BigNumber>;

    getPricePerFullShare(overrides?: CallOverrides): Promise<BigNumber>;

    governance(overrides?: CallOverrides): Promise<BigNumber>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    max(overrides?: CallOverrides): Promise<BigNumber>;

    min(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    setGovernance(_governance: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    setMin(_min: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    vault(overrides?: CallOverrides): Promise<BigNumber>;

    withdraw(_shares: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    withdrawAll(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;
  };

  populateTransaction: {
    aToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    aave(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    available(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceUnderlying(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    deposit(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    depositAll(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    earn(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    getAave(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getAaveCore(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPricePerFullShare(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    governance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    max(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    min(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setGovernance(
      _governance: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setMin(
      _min: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transfer(
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    transferFrom(
      sender: string,
      recipient: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    vault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdraw(
      _shares: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    withdrawAll(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;
  };
}
