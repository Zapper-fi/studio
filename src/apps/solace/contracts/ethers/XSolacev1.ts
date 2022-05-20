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

export interface XSolacev1Interface extends utils.Interface {
  functions: {
    'DOMAIN_SEPARATOR()': FunctionFragment;
    'acceptGovernance()': FunctionFragment;
    'allowance(address,address)': FunctionFragment;
    'approve(address,uint256)': FunctionFragment;
    'balanceOf(address)': FunctionFragment;
    'burn(uint256)': FunctionFragment;
    'decimals()': FunctionFragment;
    'decreaseAllowance(address,uint256)': FunctionFragment;
    'governance()': FunctionFragment;
    'governanceIsLocked()': FunctionFragment;
    'increaseAllowance(address,uint256)': FunctionFragment;
    'lockGovernance()': FunctionFragment;
    'name()': FunctionFragment;
    'nonces(address)': FunctionFragment;
    'pendingGovernance()': FunctionFragment;
    'permit(address,address,uint256,uint256,uint8,bytes32,bytes32)': FunctionFragment;
    'setPendingGovernance(address)': FunctionFragment;
    'solace()': FunctionFragment;
    'solaceToXSolace(uint256)': FunctionFragment;
    'stake(uint256)': FunctionFragment;
    'stakeSigned(address,uint256,uint256,uint8,bytes32,bytes32)': FunctionFragment;
    'symbol()': FunctionFragment;
    'totalSupply()': FunctionFragment;
    'transfer(address,uint256)': FunctionFragment;
    'transferFrom(address,address,uint256)': FunctionFragment;
    'unstake(uint256)': FunctionFragment;
    'xSolaceToSolace(uint256)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'DOMAIN_SEPARATOR'
      | 'acceptGovernance'
      | 'allowance'
      | 'approve'
      | 'balanceOf'
      | 'burn'
      | 'decimals'
      | 'decreaseAllowance'
      | 'governance'
      | 'governanceIsLocked'
      | 'increaseAllowance'
      | 'lockGovernance'
      | 'name'
      | 'nonces'
      | 'pendingGovernance'
      | 'permit'
      | 'setPendingGovernance'
      | 'solace'
      | 'solaceToXSolace'
      | 'stake'
      | 'stakeSigned'
      | 'symbol'
      | 'totalSupply'
      | 'transfer'
      | 'transferFrom'
      | 'unstake'
      | 'xSolaceToSolace',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'DOMAIN_SEPARATOR', values?: undefined): string;
  encodeFunctionData(functionFragment: 'acceptGovernance', values?: undefined): string;
  encodeFunctionData(functionFragment: 'allowance', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'approve', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'balanceOf', values: [string]): string;
  encodeFunctionData(functionFragment: 'burn', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'decimals', values?: undefined): string;
  encodeFunctionData(functionFragment: 'decreaseAllowance', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'governance', values?: undefined): string;
  encodeFunctionData(functionFragment: 'governanceIsLocked', values?: undefined): string;
  encodeFunctionData(functionFragment: 'increaseAllowance', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'lockGovernance', values?: undefined): string;
  encodeFunctionData(functionFragment: 'name', values?: undefined): string;
  encodeFunctionData(functionFragment: 'nonces', values: [string]): string;
  encodeFunctionData(functionFragment: 'pendingGovernance', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'permit',
    values: [string, string, BigNumberish, BigNumberish, BigNumberish, BytesLike, BytesLike],
  ): string;
  encodeFunctionData(functionFragment: 'setPendingGovernance', values: [string]): string;
  encodeFunctionData(functionFragment: 'solace', values?: undefined): string;
  encodeFunctionData(functionFragment: 'solaceToXSolace', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'stake', values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: 'stakeSigned',
    values: [string, BigNumberish, BigNumberish, BigNumberish, BytesLike, BytesLike],
  ): string;
  encodeFunctionData(functionFragment: 'symbol', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalSupply', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transfer', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'transferFrom', values: [string, string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'unstake', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'xSolaceToSolace', values: [BigNumberish]): string;

  decodeFunctionResult(functionFragment: 'DOMAIN_SEPARATOR', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'acceptGovernance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'allowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'burn', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'decimals', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'decreaseAllowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'governance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'governanceIsLocked', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'increaseAllowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'lockGovernance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'nonces', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pendingGovernance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'permit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setPendingGovernance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'solace', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'solaceToXSolace', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'stake', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'stakeSigned', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transfer', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferFrom', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'unstake', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'xSolaceToSolace', data: BytesLike): Result;

  events: {
    'Approval(address,address,uint256)': EventFragment;
    'GovernanceLocked()': EventFragment;
    'GovernancePending(address)': EventFragment;
    'GovernanceTransferred(address,address)': EventFragment;
    'Staked(address,uint256,uint256)': EventFragment;
    'Transfer(address,address,uint256)': EventFragment;
    'Unstaked(address,uint256,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Approval'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'GovernanceLocked'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'GovernancePending'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'GovernanceTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Staked'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Transfer'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Unstaked'): EventFragment;
}

export interface ApprovalEventObject {
  owner: string;
  spender: string;
  value: BigNumber;
}
export type ApprovalEvent = TypedEvent<[string, string, BigNumber], ApprovalEventObject>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export interface GovernanceLockedEventObject {}
export type GovernanceLockedEvent = TypedEvent<[], GovernanceLockedEventObject>;

export type GovernanceLockedEventFilter = TypedEventFilter<GovernanceLockedEvent>;

export interface GovernancePendingEventObject {
  pendingGovernance: string;
}
export type GovernancePendingEvent = TypedEvent<[string], GovernancePendingEventObject>;

export type GovernancePendingEventFilter = TypedEventFilter<GovernancePendingEvent>;

export interface GovernanceTransferredEventObject {
  oldGovernance: string;
  newGovernance: string;
}
export type GovernanceTransferredEvent = TypedEvent<[string, string], GovernanceTransferredEventObject>;

export type GovernanceTransferredEventFilter = TypedEventFilter<GovernanceTransferredEvent>;

export interface StakedEventObject {
  user: string;
  amountSolace: BigNumber;
  amountXSolace: BigNumber;
}
export type StakedEvent = TypedEvent<[string, BigNumber, BigNumber], StakedEventObject>;

export type StakedEventFilter = TypedEventFilter<StakedEvent>;

export interface TransferEventObject {
  from: string;
  to: string;
  value: BigNumber;
}
export type TransferEvent = TypedEvent<[string, string, BigNumber], TransferEventObject>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface UnstakedEventObject {
  user: string;
  amountSolace: BigNumber;
  amountXSolace: BigNumber;
}
export type UnstakedEvent = TypedEvent<[string, BigNumber, BigNumber], UnstakedEventObject>;

export type UnstakedEventFilter = TypedEventFilter<UnstakedEvent>;

export interface XSolacev1 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: XSolacev1Interface;

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
    DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<[string]>;

    acceptGovernance(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    burn(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    decimals(overrides?: CallOverrides): Promise<[number]>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    governance(overrides?: CallOverrides): Promise<[string]>;

    governanceIsLocked(overrides?: CallOverrides): Promise<[boolean]>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    lockGovernance(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    name(overrides?: CallOverrides): Promise<[string]>;

    nonces(owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    pendingGovernance(overrides?: CallOverrides): Promise<[string]>;

    permit(
      owner: string,
      spender: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    setPendingGovernance(
      pendingGovernance_: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    solace(overrides?: CallOverrides): Promise<[string] & { solace_: string }>;

    solaceToXSolace(
      amountSolace: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { amountXSolace: BigNumber }>;

    stake(
      amountSolace: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    stakeSigned(
      depositor: string,
      amountSolace: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

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

    unstake(
      amountXSolace: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    xSolaceToSolace(
      amountXSolace: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { amountSolace: BigNumber }>;
  };

  DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<string>;

  acceptGovernance(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;

  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

  burn(amount: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  decimals(overrides?: CallOverrides): Promise<number>;

  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  governance(overrides?: CallOverrides): Promise<string>;

  governanceIsLocked(overrides?: CallOverrides): Promise<boolean>;

  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  lockGovernance(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  name(overrides?: CallOverrides): Promise<string>;

  nonces(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  pendingGovernance(overrides?: CallOverrides): Promise<string>;

  permit(
    owner: string,
    spender: string,
    value: BigNumberish,
    deadline: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  setPendingGovernance(
    pendingGovernance_: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  solace(overrides?: CallOverrides): Promise<string>;

  solaceToXSolace(amountSolace: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  stake(
    amountSolace: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  stakeSigned(
    depositor: string,
    amountSolace: BigNumberish,
    deadline: BigNumberish,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  symbol(overrides?: CallOverrides): Promise<string>;

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

  unstake(
    amountXSolace: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  xSolaceToSolace(amountXSolace: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<string>;

    acceptGovernance(overrides?: CallOverrides): Promise<void>;

    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;

    approve(spender: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    burn(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    decimals(overrides?: CallOverrides): Promise<number>;

    decreaseAllowance(spender: string, subtractedValue: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    governance(overrides?: CallOverrides): Promise<string>;

    governanceIsLocked(overrides?: CallOverrides): Promise<boolean>;

    increaseAllowance(spender: string, addedValue: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    lockGovernance(overrides?: CallOverrides): Promise<void>;

    name(overrides?: CallOverrides): Promise<string>;

    nonces(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    pendingGovernance(overrides?: CallOverrides): Promise<string>;

    permit(
      owner: string,
      spender: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides,
    ): Promise<void>;

    setPendingGovernance(pendingGovernance_: string, overrides?: CallOverrides): Promise<void>;

    solace(overrides?: CallOverrides): Promise<string>;

    solaceToXSolace(amountSolace: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    stake(amountSolace: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    stakeSigned(
      depositor: string,
      amountSolace: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(recipient: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    transferFrom(sender: string, recipient: string, amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    unstake(amountXSolace: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    xSolaceToSolace(amountXSolace: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    'Approval(address,address,uint256)'(
      owner?: string | null,
      spender?: string | null,
      value?: null,
    ): ApprovalEventFilter;
    Approval(owner?: string | null, spender?: string | null, value?: null): ApprovalEventFilter;

    'GovernanceLocked()'(): GovernanceLockedEventFilter;
    GovernanceLocked(): GovernanceLockedEventFilter;

    'GovernancePending(address)'(pendingGovernance?: null): GovernancePendingEventFilter;
    GovernancePending(pendingGovernance?: null): GovernancePendingEventFilter;

    'GovernanceTransferred(address,address)'(
      oldGovernance?: null,
      newGovernance?: null,
    ): GovernanceTransferredEventFilter;
    GovernanceTransferred(oldGovernance?: null, newGovernance?: null): GovernanceTransferredEventFilter;

    'Staked(address,uint256,uint256)'(user?: null, amountSolace?: null, amountXSolace?: null): StakedEventFilter;
    Staked(user?: null, amountSolace?: null, amountXSolace?: null): StakedEventFilter;

    'Transfer(address,address,uint256)'(from?: string | null, to?: string | null, value?: null): TransferEventFilter;
    Transfer(from?: string | null, to?: string | null, value?: null): TransferEventFilter;

    'Unstaked(address,uint256,uint256)'(user?: null, amountSolace?: null, amountXSolace?: null): UnstakedEventFilter;
    Unstaked(user?: null, amountSolace?: null, amountXSolace?: null): UnstakedEventFilter;
  };

  estimateGas: {
    DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<BigNumber>;

    acceptGovernance(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

    burn(amount: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    governance(overrides?: CallOverrides): Promise<BigNumber>;

    governanceIsLocked(overrides?: CallOverrides): Promise<BigNumber>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    lockGovernance(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    nonces(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    pendingGovernance(overrides?: CallOverrides): Promise<BigNumber>;

    permit(
      owner: string,
      spender: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    setPendingGovernance(
      pendingGovernance_: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    solace(overrides?: CallOverrides): Promise<BigNumber>;

    solaceToXSolace(amountSolace: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    stake(amountSolace: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    stakeSigned(
      depositor: string,
      amountSolace: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

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

    unstake(
      amountXSolace: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    xSolaceToSolace(amountXSolace: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    DOMAIN_SEPARATOR(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    acceptGovernance(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    allowance(owner: string, spender: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    burn(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    governance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    governanceIsLocked(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    lockGovernance(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nonces(owner: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingGovernance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    permit(
      owner: string,
      spender: string,
      value: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    setPendingGovernance(
      pendingGovernance_: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    solace(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    solaceToXSolace(amountSolace: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    stake(
      amountSolace: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    stakeSigned(
      depositor: string,
      amountSolace: BigNumberish,
      deadline: BigNumberish,
      v: BigNumberish,
      r: BytesLike,
      s: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

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

    unstake(
      amountXSolace: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    xSolaceToSolace(amountXSolace: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
