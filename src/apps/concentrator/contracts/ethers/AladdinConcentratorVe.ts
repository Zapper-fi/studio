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

export interface AladdinConcentratorVeInterface extends utils.Interface {
  functions: {
    'commit_transfer_ownership(address)': FunctionFragment;
    'apply_transfer_ownership()': FunctionFragment;
    'commit_smart_wallet_checker(address)': FunctionFragment;
    'apply_smart_wallet_checker()': FunctionFragment;
    'get_last_user_slope(address)': FunctionFragment;
    'user_point_history__ts(address,uint256)': FunctionFragment;
    'locked__end(address)': FunctionFragment;
    'checkpoint()': FunctionFragment;
    'deposit_for(address,uint256)': FunctionFragment;
    'create_lock(uint256,uint256)': FunctionFragment;
    'increase_amount(uint256)': FunctionFragment;
    'increase_unlock_time(uint256)': FunctionFragment;
    'withdraw()': FunctionFragment;
    'balanceOf(address)': FunctionFragment;
    'balanceOfAt(address,uint256)': FunctionFragment;
    'totalSupply()': FunctionFragment;
    'totalSupply(uint256)': FunctionFragment;
    'totalSupplyAt(uint256)': FunctionFragment;
    'changeController(address)': FunctionFragment;
    'token()': FunctionFragment;
    'supply()': FunctionFragment;
    'locked(address)': FunctionFragment;
    'epoch()': FunctionFragment;
    'point_history(uint256)': FunctionFragment;
    'user_point_history(address,uint256)': FunctionFragment;
    'user_point_epoch(address)': FunctionFragment;
    'slope_changes(uint256)': FunctionFragment;
    'controller()': FunctionFragment;
    'transfersEnabled()': FunctionFragment;
    'name()': FunctionFragment;
    'symbol()': FunctionFragment;
    'version()': FunctionFragment;
    'decimals()': FunctionFragment;
    'future_smart_wallet_checker()': FunctionFragment;
    'smart_wallet_checker()': FunctionFragment;
    'admin()': FunctionFragment;
    'future_admin()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'commit_transfer_ownership'
      | 'apply_transfer_ownership'
      | 'commit_smart_wallet_checker'
      | 'apply_smart_wallet_checker'
      | 'get_last_user_slope'
      | 'user_point_history__ts'
      | 'locked__end'
      | 'checkpoint'
      | 'deposit_for'
      | 'create_lock'
      | 'increase_amount'
      | 'increase_unlock_time'
      | 'withdraw'
      | 'balanceOf'
      | 'balanceOfAt'
      | 'totalSupply()'
      | 'totalSupply(uint256)'
      | 'totalSupplyAt'
      | 'changeController'
      | 'token'
      | 'supply'
      | 'locked'
      | 'epoch'
      | 'point_history'
      | 'user_point_history'
      | 'user_point_epoch'
      | 'slope_changes'
      | 'controller'
      | 'transfersEnabled'
      | 'name'
      | 'symbol'
      | 'version'
      | 'decimals'
      | 'future_smart_wallet_checker'
      | 'smart_wallet_checker'
      | 'admin'
      | 'future_admin',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'commit_transfer_ownership', values: [string]): string;
  encodeFunctionData(functionFragment: 'apply_transfer_ownership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'commit_smart_wallet_checker', values: [string]): string;
  encodeFunctionData(functionFragment: 'apply_smart_wallet_checker', values?: undefined): string;
  encodeFunctionData(functionFragment: 'get_last_user_slope', values: [string]): string;
  encodeFunctionData(functionFragment: 'user_point_history__ts', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'locked__end', values: [string]): string;
  encodeFunctionData(functionFragment: 'checkpoint', values?: undefined): string;
  encodeFunctionData(functionFragment: 'deposit_for', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'create_lock', values: [BigNumberish, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'increase_amount', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'increase_unlock_time', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'withdraw', values?: undefined): string;
  encodeFunctionData(functionFragment: 'balanceOf', values: [string]): string;
  encodeFunctionData(functionFragment: 'balanceOfAt', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'totalSupply()', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalSupply(uint256)', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'totalSupplyAt', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'changeController', values: [string]): string;
  encodeFunctionData(functionFragment: 'token', values?: undefined): string;
  encodeFunctionData(functionFragment: 'supply', values?: undefined): string;
  encodeFunctionData(functionFragment: 'locked', values: [string]): string;
  encodeFunctionData(functionFragment: 'epoch', values?: undefined): string;
  encodeFunctionData(functionFragment: 'point_history', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'user_point_history', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'user_point_epoch', values: [string]): string;
  encodeFunctionData(functionFragment: 'slope_changes', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'controller', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transfersEnabled', values?: undefined): string;
  encodeFunctionData(functionFragment: 'name', values?: undefined): string;
  encodeFunctionData(functionFragment: 'symbol', values?: undefined): string;
  encodeFunctionData(functionFragment: 'version', values?: undefined): string;
  encodeFunctionData(functionFragment: 'decimals', values?: undefined): string;
  encodeFunctionData(functionFragment: 'future_smart_wallet_checker', values?: undefined): string;
  encodeFunctionData(functionFragment: 'smart_wallet_checker', values?: undefined): string;
  encodeFunctionData(functionFragment: 'admin', values?: undefined): string;
  encodeFunctionData(functionFragment: 'future_admin', values?: undefined): string;

  decodeFunctionResult(functionFragment: 'commit_transfer_ownership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'apply_transfer_ownership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'commit_smart_wallet_checker', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'apply_smart_wallet_checker', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'get_last_user_slope', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'user_point_history__ts', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'locked__end', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'checkpoint', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit_for', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'create_lock', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'increase_amount', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'increase_unlock_time', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'balanceOfAt', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalSupply()', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalSupply(uint256)', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalSupplyAt', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'changeController', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'token', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'supply', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'locked', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'epoch', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'point_history', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'user_point_history', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'user_point_epoch', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'slope_changes', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'controller', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transfersEnabled', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'version', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'decimals', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'future_smart_wallet_checker', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'smart_wallet_checker', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'admin', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'future_admin', data: BytesLike): Result;

  events: {
    'CommitOwnership(address)': EventFragment;
    'ApplyOwnership(address)': EventFragment;
    'Deposit(address,uint256,uint256,int128,uint256)': EventFragment;
    'Withdraw(address,uint256,uint256)': EventFragment;
    'Supply(uint256,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'CommitOwnership'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'ApplyOwnership'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Deposit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdraw'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Supply'): EventFragment;
}

export interface CommitOwnershipEventObject {
  admin: string;
}
export type CommitOwnershipEvent = TypedEvent<[string], CommitOwnershipEventObject>;

export type CommitOwnershipEventFilter = TypedEventFilter<CommitOwnershipEvent>;

export interface ApplyOwnershipEventObject {
  admin: string;
}
export type ApplyOwnershipEvent = TypedEvent<[string], ApplyOwnershipEventObject>;

export type ApplyOwnershipEventFilter = TypedEventFilter<ApplyOwnershipEvent>;

export interface DepositEventObject {
  provider: string;
  value: BigNumber;
  locktime: BigNumber;
  type: BigNumber;
  ts: BigNumber;
}
export type DepositEvent = TypedEvent<[string, BigNumber, BigNumber, BigNumber, BigNumber], DepositEventObject>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface WithdrawEventObject {
  provider: string;
  value: BigNumber;
  ts: BigNumber;
}
export type WithdrawEvent = TypedEvent<[string, BigNumber, BigNumber], WithdrawEventObject>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface SupplyEventObject {
  prevSupply: BigNumber;
  supply: BigNumber;
}
export type SupplyEvent = TypedEvent<[BigNumber, BigNumber], SupplyEventObject>;

export type SupplyEventFilter = TypedEventFilter<SupplyEvent>;

export interface AladdinConcentratorVe extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AladdinConcentratorVeInterface;

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
    commit_transfer_ownership(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    apply_transfer_ownership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    commit_smart_wallet_checker(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    apply_smart_wallet_checker(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    get_last_user_slope(addr: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    user_point_history__ts(_addr: string, _idx: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    locked__end(_addr: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    checkpoint(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    deposit_for(
      _addr: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    create_lock(
      _value: BigNumberish,
      _unlock_time: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    increase_amount(
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    increase_unlock_time(
      _unlock_time: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    withdraw(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    balanceOf(addr: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceOfAt(addr: string, _block: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    'totalSupply()'(overrides?: CallOverrides): Promise<[BigNumber]>;

    'totalSupply(uint256)'(t: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    totalSupplyAt(_block: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    changeController(
      _newController: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    token(overrides?: CallOverrides): Promise<[string]>;

    supply(overrides?: CallOverrides): Promise<[BigNumber]>;

    locked(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<[[BigNumber, BigNumber] & { amount: BigNumber; end: BigNumber }]>;

    epoch(overrides?: CallOverrides): Promise<[BigNumber]>;

    point_history(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [
        [BigNumber, BigNumber, BigNumber, BigNumber] & {
          bias: BigNumber;
          slope: BigNumber;
          ts: BigNumber;
          blk: BigNumber;
        },
      ]
    >;

    user_point_history(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [
        [BigNumber, BigNumber, BigNumber, BigNumber] & {
          bias: BigNumber;
          slope: BigNumber;
          ts: BigNumber;
          blk: BigNumber;
        },
      ]
    >;

    user_point_epoch(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    slope_changes(arg0: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    controller(overrides?: CallOverrides): Promise<[string]>;

    transfersEnabled(overrides?: CallOverrides): Promise<[boolean]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    version(overrides?: CallOverrides): Promise<[string]>;

    decimals(overrides?: CallOverrides): Promise<[BigNumber]>;

    future_smart_wallet_checker(overrides?: CallOverrides): Promise<[string]>;

    smart_wallet_checker(overrides?: CallOverrides): Promise<[string]>;

    admin(overrides?: CallOverrides): Promise<[string]>;

    future_admin(overrides?: CallOverrides): Promise<[string]>;
  };

  commit_transfer_ownership(
    addr: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  apply_transfer_ownership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  commit_smart_wallet_checker(
    addr: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  apply_smart_wallet_checker(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  get_last_user_slope(addr: string, overrides?: CallOverrides): Promise<BigNumber>;

  user_point_history__ts(_addr: string, _idx: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  locked__end(_addr: string, overrides?: CallOverrides): Promise<BigNumber>;

  checkpoint(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  deposit_for(
    _addr: string,
    _value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  create_lock(
    _value: BigNumberish,
    _unlock_time: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  increase_amount(
    _value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  increase_unlock_time(
    _unlock_time: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  withdraw(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  balanceOf(addr: string, overrides?: CallOverrides): Promise<BigNumber>;

  balanceOfAt(addr: string, _block: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  'totalSupply()'(overrides?: CallOverrides): Promise<BigNumber>;

  'totalSupply(uint256)'(t: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  totalSupplyAt(_block: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  changeController(
    _newController: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  token(overrides?: CallOverrides): Promise<string>;

  supply(overrides?: CallOverrides): Promise<BigNumber>;

  locked(
    arg0: string,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; end: BigNumber }>;

  epoch(overrides?: CallOverrides): Promise<BigNumber>;

  point_history(
    arg0: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      bias: BigNumber;
      slope: BigNumber;
      ts: BigNumber;
      blk: BigNumber;
    }
  >;

  user_point_history(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      bias: BigNumber;
      slope: BigNumber;
      ts: BigNumber;
      blk: BigNumber;
    }
  >;

  user_point_epoch(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  slope_changes(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  controller(overrides?: CallOverrides): Promise<string>;

  transfersEnabled(overrides?: CallOverrides): Promise<boolean>;

  name(overrides?: CallOverrides): Promise<string>;

  symbol(overrides?: CallOverrides): Promise<string>;

  version(overrides?: CallOverrides): Promise<string>;

  decimals(overrides?: CallOverrides): Promise<BigNumber>;

  future_smart_wallet_checker(overrides?: CallOverrides): Promise<string>;

  smart_wallet_checker(overrides?: CallOverrides): Promise<string>;

  admin(overrides?: CallOverrides): Promise<string>;

  future_admin(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    commit_transfer_ownership(addr: string, overrides?: CallOverrides): Promise<void>;

    apply_transfer_ownership(overrides?: CallOverrides): Promise<void>;

    commit_smart_wallet_checker(addr: string, overrides?: CallOverrides): Promise<void>;

    apply_smart_wallet_checker(overrides?: CallOverrides): Promise<void>;

    get_last_user_slope(addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    user_point_history__ts(_addr: string, _idx: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    locked__end(_addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    checkpoint(overrides?: CallOverrides): Promise<void>;

    deposit_for(_addr: string, _value: BigNumberish, overrides?: CallOverrides): Promise<void>;

    create_lock(_value: BigNumberish, _unlock_time: BigNumberish, overrides?: CallOverrides): Promise<void>;

    increase_amount(_value: BigNumberish, overrides?: CallOverrides): Promise<void>;

    increase_unlock_time(_unlock_time: BigNumberish, overrides?: CallOverrides): Promise<void>;

    withdraw(overrides?: CallOverrides): Promise<void>;

    balanceOf(addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfAt(addr: string, _block: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    'totalSupply()'(overrides?: CallOverrides): Promise<BigNumber>;

    'totalSupply(uint256)'(t: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    totalSupplyAt(_block: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    changeController(_newController: string, overrides?: CallOverrides): Promise<void>;

    token(overrides?: CallOverrides): Promise<string>;

    supply(overrides?: CallOverrides): Promise<BigNumber>;

    locked(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount: BigNumber; end: BigNumber }>;

    epoch(overrides?: CallOverrides): Promise<BigNumber>;

    point_history(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        bias: BigNumber;
        slope: BigNumber;
        ts: BigNumber;
        blk: BigNumber;
      }
    >;

    user_point_history(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        bias: BigNumber;
        slope: BigNumber;
        ts: BigNumber;
        blk: BigNumber;
      }
    >;

    user_point_epoch(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    slope_changes(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    controller(overrides?: CallOverrides): Promise<string>;

    transfersEnabled(overrides?: CallOverrides): Promise<boolean>;

    name(overrides?: CallOverrides): Promise<string>;

    symbol(overrides?: CallOverrides): Promise<string>;

    version(overrides?: CallOverrides): Promise<string>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    future_smart_wallet_checker(overrides?: CallOverrides): Promise<string>;

    smart_wallet_checker(overrides?: CallOverrides): Promise<string>;

    admin(overrides?: CallOverrides): Promise<string>;

    future_admin(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    'CommitOwnership(address)'(admin?: null): CommitOwnershipEventFilter;
    CommitOwnership(admin?: null): CommitOwnershipEventFilter;

    'ApplyOwnership(address)'(admin?: null): ApplyOwnershipEventFilter;
    ApplyOwnership(admin?: null): ApplyOwnershipEventFilter;

    'Deposit(address,uint256,uint256,int128,uint256)'(
      provider?: string | null,
      value?: null,
      locktime?: BigNumberish | null,
      type?: null,
      ts?: null,
    ): DepositEventFilter;
    Deposit(
      provider?: string | null,
      value?: null,
      locktime?: BigNumberish | null,
      type?: null,
      ts?: null,
    ): DepositEventFilter;

    'Withdraw(address,uint256,uint256)'(provider?: string | null, value?: null, ts?: null): WithdrawEventFilter;
    Withdraw(provider?: string | null, value?: null, ts?: null): WithdrawEventFilter;

    'Supply(uint256,uint256)'(prevSupply?: null, supply?: null): SupplyEventFilter;
    Supply(prevSupply?: null, supply?: null): SupplyEventFilter;
  };

  estimateGas: {
    commit_transfer_ownership(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    apply_transfer_ownership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    commit_smart_wallet_checker(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    apply_smart_wallet_checker(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    get_last_user_slope(addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    user_point_history__ts(_addr: string, _idx: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    locked__end(_addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    checkpoint(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    deposit_for(
      _addr: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    create_lock(
      _value: BigNumberish,
      _unlock_time: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    increase_amount(
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    increase_unlock_time(
      _unlock_time: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    withdraw(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    balanceOf(addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfAt(addr: string, _block: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    'totalSupply()'(overrides?: CallOverrides): Promise<BigNumber>;

    'totalSupply(uint256)'(t: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    totalSupplyAt(_block: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    changeController(
      _newController: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    supply(overrides?: CallOverrides): Promise<BigNumber>;

    locked(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    epoch(overrides?: CallOverrides): Promise<BigNumber>;

    point_history(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    user_point_history(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    user_point_epoch(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    slope_changes(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    controller(overrides?: CallOverrides): Promise<BigNumber>;

    transfersEnabled(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    version(overrides?: CallOverrides): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    future_smart_wallet_checker(overrides?: CallOverrides): Promise<BigNumber>;

    smart_wallet_checker(overrides?: CallOverrides): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<BigNumber>;

    future_admin(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    commit_transfer_ownership(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    apply_transfer_ownership(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    commit_smart_wallet_checker(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    apply_smart_wallet_checker(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    get_last_user_slope(addr: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    user_point_history__ts(_addr: string, _idx: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    locked__end(_addr: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    checkpoint(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    deposit_for(
      _addr: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    create_lock(
      _value: BigNumberish,
      _unlock_time: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    increase_amount(
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    increase_unlock_time(
      _unlock_time: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    withdraw(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    balanceOf(addr: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOfAt(addr: string, _block: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    'totalSupply()'(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    'totalSupply(uint256)'(t: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupplyAt(_block: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    changeController(
      _newController: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    supply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    locked(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    epoch(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    point_history(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    user_point_history(arg0: string, arg1: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    user_point_epoch(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    slope_changes(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    controller(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transfersEnabled(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    version(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    future_smart_wallet_checker(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    smart_wallet_checker(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    future_admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
