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

export interface CurveRewardsOnlyGaugeInterface extends utils.Interface {
  functions: {
    'decimals()': FunctionFragment;
    'reward_contract()': FunctionFragment;
    'last_claim()': FunctionFragment;
    'claimed_reward(address,address)': FunctionFragment;
    'claimable_reward(address,address)': FunctionFragment;
    'claimable_reward_write(address,address)': FunctionFragment;
    'set_rewards_receiver(address)': FunctionFragment;
    'claim_rewards()': FunctionFragment;
    'claim_rewards(address)': FunctionFragment;
    'claim_rewards(address,address)': FunctionFragment;
    'deposit(uint256)': FunctionFragment;
    'deposit(uint256,address)': FunctionFragment;
    'deposit(uint256,address,bool)': FunctionFragment;
    'withdraw(uint256)': FunctionFragment;
    'withdraw(uint256,bool)': FunctionFragment;
    'transfer(address,uint256)': FunctionFragment;
    'transferFrom(address,address,uint256)': FunctionFragment;
    'approve(address,uint256)': FunctionFragment;
    'increaseAllowance(address,uint256)': FunctionFragment;
    'decreaseAllowance(address,uint256)': FunctionFragment;
    'set_rewards(address,bytes32,address[8])': FunctionFragment;
    'commit_transfer_ownership(address)': FunctionFragment;
    'accept_transfer_ownership()': FunctionFragment;
    'lp_token()': FunctionFragment;
    'balanceOf(address)': FunctionFragment;
    'totalSupply()': FunctionFragment;
    'allowance(address,address)': FunctionFragment;
    'name()': FunctionFragment;
    'symbol()': FunctionFragment;
    'reward_tokens(uint256)': FunctionFragment;
    'reward_balances(address)': FunctionFragment;
    'rewards_receiver(address)': FunctionFragment;
    'claim_sig()': FunctionFragment;
    'reward_integral(address)': FunctionFragment;
    'reward_integral_for(address,address)': FunctionFragment;
    'admin()': FunctionFragment;
    'future_admin()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'decimals'
      | 'reward_contract'
      | 'last_claim'
      | 'claimed_reward'
      | 'claimable_reward'
      | 'claimable_reward_write'
      | 'set_rewards_receiver'
      | 'claim_rewards()'
      | 'claim_rewards(address)'
      | 'claim_rewards(address,address)'
      | 'deposit(uint256)'
      | 'deposit(uint256,address)'
      | 'deposit(uint256,address,bool)'
      | 'withdraw(uint256)'
      | 'withdraw(uint256,bool)'
      | 'transfer'
      | 'transferFrom'
      | 'approve'
      | 'increaseAllowance'
      | 'decreaseAllowance'
      | 'set_rewards'
      | 'commit_transfer_ownership'
      | 'accept_transfer_ownership'
      | 'lp_token'
      | 'balanceOf'
      | 'totalSupply'
      | 'allowance'
      | 'name'
      | 'symbol'
      | 'reward_tokens'
      | 'reward_balances'
      | 'rewards_receiver'
      | 'claim_sig'
      | 'reward_integral'
      | 'reward_integral_for'
      | 'admin'
      | 'future_admin',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'decimals', values?: undefined): string;
  encodeFunctionData(functionFragment: 'reward_contract', values?: undefined): string;
  encodeFunctionData(functionFragment: 'last_claim', values?: undefined): string;
  encodeFunctionData(functionFragment: 'claimed_reward', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'claimable_reward', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'claimable_reward_write', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'set_rewards_receiver', values: [string]): string;
  encodeFunctionData(functionFragment: 'claim_rewards()', values?: undefined): string;
  encodeFunctionData(functionFragment: 'claim_rewards(address)', values: [string]): string;
  encodeFunctionData(functionFragment: 'claim_rewards(address,address)', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'deposit(uint256)', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'deposit(uint256,address)', values: [BigNumberish, string]): string;
  encodeFunctionData(
    functionFragment: 'deposit(uint256,address,bool)',
    values: [BigNumberish, string, boolean],
  ): string;
  encodeFunctionData(functionFragment: 'withdraw(uint256)', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'withdraw(uint256,bool)', values: [BigNumberish, boolean]): string;
  encodeFunctionData(functionFragment: 'transfer', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'transferFrom', values: [string, string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'approve', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'increaseAllowance', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'decreaseAllowance', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'set_rewards', values: [string, BytesLike, string[]]): string;
  encodeFunctionData(functionFragment: 'commit_transfer_ownership', values: [string]): string;
  encodeFunctionData(functionFragment: 'accept_transfer_ownership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'lp_token', values?: undefined): string;
  encodeFunctionData(functionFragment: 'balanceOf', values: [string]): string;
  encodeFunctionData(functionFragment: 'totalSupply', values?: undefined): string;
  encodeFunctionData(functionFragment: 'allowance', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'name', values?: undefined): string;
  encodeFunctionData(functionFragment: 'symbol', values?: undefined): string;
  encodeFunctionData(functionFragment: 'reward_tokens', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'reward_balances', values: [string]): string;
  encodeFunctionData(functionFragment: 'rewards_receiver', values: [string]): string;
  encodeFunctionData(functionFragment: 'claim_sig', values?: undefined): string;
  encodeFunctionData(functionFragment: 'reward_integral', values: [string]): string;
  encodeFunctionData(functionFragment: 'reward_integral_for', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'admin', values?: undefined): string;
  encodeFunctionData(functionFragment: 'future_admin', values?: undefined): string;

  decodeFunctionResult(functionFragment: 'decimals', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'reward_contract', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'last_claim', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimed_reward', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimable_reward', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimable_reward_write', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'set_rewards_receiver', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claim_rewards()', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claim_rewards(address)', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claim_rewards(address,address)', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit(uint256)', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit(uint256,address)', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit(uint256,address,bool)', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw(uint256)', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdraw(uint256,bool)', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transfer', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferFrom', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'increaseAllowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'decreaseAllowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'set_rewards', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'commit_transfer_ownership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'accept_transfer_ownership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lp_token', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'allowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'reward_tokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'reward_balances', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'rewards_receiver', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claim_sig', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'reward_integral', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'reward_integral_for', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'admin', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'future_admin', data: BytesLike): Result;

  events: {
    'Deposit(address,uint256)': EventFragment;
    'Withdraw(address,uint256)': EventFragment;
    'CommitOwnership(address)': EventFragment;
    'ApplyOwnership(address)': EventFragment;
    'Transfer(address,address,uint256)': EventFragment;
    'Approval(address,address,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Deposit'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Withdraw'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'CommitOwnership'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'ApplyOwnership'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Transfer'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Approval'): EventFragment;
}

export interface DepositEventObject {
  provider: string;
  value: BigNumber;
}
export type DepositEvent = TypedEvent<[string, BigNumber], DepositEventObject>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface WithdrawEventObject {
  provider: string;
  value: BigNumber;
}
export type WithdrawEvent = TypedEvent<[string, BigNumber], WithdrawEventObject>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

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

export interface TransferEventObject {
  _from: string;
  _to: string;
  _value: BigNumber;
}
export type TransferEvent = TypedEvent<[string, string, BigNumber], TransferEventObject>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface ApprovalEventObject {
  _owner: string;
  _spender: string;
  _value: BigNumber;
}
export type ApprovalEvent = TypedEvent<[string, string, BigNumber], ApprovalEventObject>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export interface CurveRewardsOnlyGauge extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CurveRewardsOnlyGaugeInterface;

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
    decimals(overrides?: CallOverrides): Promise<[BigNumber]>;

    reward_contract(overrides?: CallOverrides): Promise<[string]>;

    last_claim(overrides?: CallOverrides): Promise<[BigNumber]>;

    claimed_reward(_addr: string, _token: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    claimable_reward(_addr: string, _token: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    claimable_reward_write(_addr: string, _token: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    set_rewards_receiver(
      _receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    'claim_rewards()'(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    'claim_rewards(address)'(
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    'claim_rewards(address,address)'(
      _addr: string,
      _receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    'deposit(uint256)'(
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    'deposit(uint256,address)'(
      _value: BigNumberish,
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    'deposit(uint256,address,bool)'(
      _value: BigNumberish,
      _addr: string,
      _claim_rewards: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    'withdraw(uint256)'(
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    'withdraw(uint256,bool)'(
      _value: BigNumberish,
      _claim_rewards: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    transfer(
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    transferFrom(
      _from: string,
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    approve(
      _spender: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    increaseAllowance(
      _spender: string,
      _added_value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    decreaseAllowance(
      _spender: string,
      _subtracted_value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    set_rewards(
      _reward_contract: string,
      _claim_sig: BytesLike,
      _reward_tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    commit_transfer_ownership(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    accept_transfer_ownership(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    lp_token(overrides?: CallOverrides): Promise<[string]>;

    balanceOf(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    allowance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    reward_tokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    reward_balances(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    rewards_receiver(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    claim_sig(overrides?: CallOverrides): Promise<[string]>;

    reward_integral(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    reward_integral_for(arg0: string, arg1: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    admin(overrides?: CallOverrides): Promise<[string]>;

    future_admin(overrides?: CallOverrides): Promise<[string]>;
  };

  decimals(overrides?: CallOverrides): Promise<BigNumber>;

  reward_contract(overrides?: CallOverrides): Promise<string>;

  last_claim(overrides?: CallOverrides): Promise<BigNumber>;

  claimed_reward(_addr: string, _token: string, overrides?: CallOverrides): Promise<BigNumber>;

  claimable_reward(_addr: string, _token: string, overrides?: CallOverrides): Promise<BigNumber>;

  claimable_reward_write(_addr: string, _token: string, overrides?: CallOverrides): Promise<BigNumber>;

  set_rewards_receiver(
    _receiver: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  'claim_rewards()'(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  'claim_rewards(address)'(
    _addr: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  'claim_rewards(address,address)'(
    _addr: string,
    _receiver: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  'deposit(uint256)'(
    _value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  'deposit(uint256,address)'(
    _value: BigNumberish,
    _addr: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  'deposit(uint256,address,bool)'(
    _value: BigNumberish,
    _addr: string,
    _claim_rewards: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  'withdraw(uint256)'(
    _value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  'withdraw(uint256,bool)'(
    _value: BigNumberish,
    _claim_rewards: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  transfer(
    _to: string,
    _value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  transferFrom(
    _from: string,
    _to: string,
    _value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  approve(
    _spender: string,
    _value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  increaseAllowance(
    _spender: string,
    _added_value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  decreaseAllowance(
    _spender: string,
    _subtracted_value: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  set_rewards(
    _reward_contract: string,
    _claim_sig: BytesLike,
    _reward_tokens: string[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  commit_transfer_ownership(
    addr: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  accept_transfer_ownership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  lp_token(overrides?: CallOverrides): Promise<string>;

  balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  allowance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

  name(overrides?: CallOverrides): Promise<string>;

  symbol(overrides?: CallOverrides): Promise<string>;

  reward_tokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  reward_balances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  rewards_receiver(arg0: string, overrides?: CallOverrides): Promise<string>;

  claim_sig(overrides?: CallOverrides): Promise<string>;

  reward_integral(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  reward_integral_for(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

  admin(overrides?: CallOverrides): Promise<string>;

  future_admin(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    reward_contract(overrides?: CallOverrides): Promise<string>;

    last_claim(overrides?: CallOverrides): Promise<BigNumber>;

    claimed_reward(_addr: string, _token: string, overrides?: CallOverrides): Promise<BigNumber>;

    claimable_reward(_addr: string, _token: string, overrides?: CallOverrides): Promise<BigNumber>;

    claimable_reward_write(_addr: string, _token: string, overrides?: CallOverrides): Promise<BigNumber>;

    set_rewards_receiver(_receiver: string, overrides?: CallOverrides): Promise<void>;

    'claim_rewards()'(overrides?: CallOverrides): Promise<void>;

    'claim_rewards(address)'(_addr: string, overrides?: CallOverrides): Promise<void>;

    'claim_rewards(address,address)'(_addr: string, _receiver: string, overrides?: CallOverrides): Promise<void>;

    'deposit(uint256)'(_value: BigNumberish, overrides?: CallOverrides): Promise<void>;

    'deposit(uint256,address)'(_value: BigNumberish, _addr: string, overrides?: CallOverrides): Promise<void>;

    'deposit(uint256,address,bool)'(
      _value: BigNumberish,
      _addr: string,
      _claim_rewards: boolean,
      overrides?: CallOverrides,
    ): Promise<void>;

    'withdraw(uint256)'(_value: BigNumberish, overrides?: CallOverrides): Promise<void>;

    'withdraw(uint256,bool)'(_value: BigNumberish, _claim_rewards: boolean, overrides?: CallOverrides): Promise<void>;

    transfer(_to: string, _value: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    transferFrom(_from: string, _to: string, _value: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    approve(_spender: string, _value: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    increaseAllowance(_spender: string, _added_value: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    decreaseAllowance(_spender: string, _subtracted_value: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    set_rewards(
      _reward_contract: string,
      _claim_sig: BytesLike,
      _reward_tokens: string[],
      overrides?: CallOverrides,
    ): Promise<void>;

    commit_transfer_ownership(addr: string, overrides?: CallOverrides): Promise<void>;

    accept_transfer_ownership(overrides?: CallOverrides): Promise<void>;

    lp_token(overrides?: CallOverrides): Promise<string>;

    balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    allowance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<string>;

    symbol(overrides?: CallOverrides): Promise<string>;

    reward_tokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    reward_balances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    rewards_receiver(arg0: string, overrides?: CallOverrides): Promise<string>;

    claim_sig(overrides?: CallOverrides): Promise<string>;

    reward_integral(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    reward_integral_for(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<string>;

    future_admin(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    'Deposit(address,uint256)'(provider?: string | null, value?: null): DepositEventFilter;
    Deposit(provider?: string | null, value?: null): DepositEventFilter;

    'Withdraw(address,uint256)'(provider?: string | null, value?: null): WithdrawEventFilter;
    Withdraw(provider?: string | null, value?: null): WithdrawEventFilter;

    'CommitOwnership(address)'(admin?: null): CommitOwnershipEventFilter;
    CommitOwnership(admin?: null): CommitOwnershipEventFilter;

    'ApplyOwnership(address)'(admin?: null): ApplyOwnershipEventFilter;
    ApplyOwnership(admin?: null): ApplyOwnershipEventFilter;

    'Transfer(address,address,uint256)'(_from?: string | null, _to?: string | null, _value?: null): TransferEventFilter;
    Transfer(_from?: string | null, _to?: string | null, _value?: null): TransferEventFilter;

    'Approval(address,address,uint256)'(
      _owner?: string | null,
      _spender?: string | null,
      _value?: null,
    ): ApprovalEventFilter;
    Approval(_owner?: string | null, _spender?: string | null, _value?: null): ApprovalEventFilter;
  };

  estimateGas: {
    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    reward_contract(overrides?: CallOverrides): Promise<BigNumber>;

    last_claim(overrides?: CallOverrides): Promise<BigNumber>;

    claimed_reward(_addr: string, _token: string, overrides?: CallOverrides): Promise<BigNumber>;

    claimable_reward(_addr: string, _token: string, overrides?: CallOverrides): Promise<BigNumber>;

    claimable_reward_write(_addr: string, _token: string, overrides?: CallOverrides): Promise<BigNumber>;

    set_rewards_receiver(
      _receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    'claim_rewards()'(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    'claim_rewards(address)'(
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    'claim_rewards(address,address)'(
      _addr: string,
      _receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    'deposit(uint256)'(
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    'deposit(uint256,address)'(
      _value: BigNumberish,
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    'deposit(uint256,address,bool)'(
      _value: BigNumberish,
      _addr: string,
      _claim_rewards: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    'withdraw(uint256)'(
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    'withdraw(uint256,bool)'(
      _value: BigNumberish,
      _claim_rewards: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    transfer(
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    transferFrom(
      _from: string,
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    approve(
      _spender: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    increaseAllowance(
      _spender: string,
      _added_value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    decreaseAllowance(
      _spender: string,
      _subtracted_value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    set_rewards(
      _reward_contract: string,
      _claim_sig: BytesLike,
      _reward_tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    commit_transfer_ownership(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    accept_transfer_ownership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    lp_token(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    allowance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    reward_tokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    reward_balances(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    rewards_receiver(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    claim_sig(overrides?: CallOverrides): Promise<BigNumber>;

    reward_integral(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    reward_integral_for(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    admin(overrides?: CallOverrides): Promise<BigNumber>;

    future_admin(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    reward_contract(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    last_claim(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimed_reward(_addr: string, _token: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimable_reward(_addr: string, _token: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimable_reward_write(_addr: string, _token: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    set_rewards_receiver(
      _receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    'claim_rewards()'(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    'claim_rewards(address)'(
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    'claim_rewards(address,address)'(
      _addr: string,
      _receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    'deposit(uint256)'(
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    'deposit(uint256,address)'(
      _value: BigNumberish,
      _addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    'deposit(uint256,address,bool)'(
      _value: BigNumberish,
      _addr: string,
      _claim_rewards: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    'withdraw(uint256)'(
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    'withdraw(uint256,bool)'(
      _value: BigNumberish,
      _claim_rewards: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    transfer(
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    transferFrom(
      _from: string,
      _to: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    approve(
      _spender: string,
      _value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    increaseAllowance(
      _spender: string,
      _added_value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    decreaseAllowance(
      _spender: string,
      _subtracted_value: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    set_rewards(
      _reward_contract: string,
      _claim_sig: BytesLike,
      _reward_tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    commit_transfer_ownership(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    accept_transfer_ownership(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    lp_token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOf(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    allowance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    reward_tokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    reward_balances(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewards_receiver(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claim_sig(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    reward_integral(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    reward_integral_for(arg0: string, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    future_admin(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
