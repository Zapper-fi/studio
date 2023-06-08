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
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface RewardableEscrowInterface extends utils.Interface {
  functions: {
    "balance()": FunctionFragment;
    "beneficiary()": FunctionFragment;
    "claimDBR()": FunctionFragment;
    "claimDBRTo(address)": FunctionFragment;
    "claimable()": FunctionFragment;
    "claimers(address)": FunctionFragment;
    "delegate(address)": FunctionFragment;
    "distributor()": FunctionFragment;
    "initialize(address,address)": FunctionFragment;
    "market()": FunctionFragment;
    "onDeposit()": FunctionFragment;
    "pay(address,uint256)": FunctionFragment;
    "setClaimer(address,bool)": FunctionFragment;
    "stakedXINV()": FunctionFragment;
    "token()": FunctionFragment;
    "xINV()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "balance"
      | "beneficiary"
      | "claimDBR"
      | "claimDBRTo"
      | "claimable"
      | "claimers"
      | "delegate"
      | "distributor"
      | "initialize"
      | "market"
      | "onDeposit"
      | "pay"
      | "setClaimer"
      | "stakedXINV"
      | "token"
      | "xINV"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "balance", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "beneficiary",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "claimDBR", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "claimDBRTo",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "claimable", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "claimers",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "delegate",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "distributor",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "market", values?: undefined): string;
  encodeFunctionData(functionFragment: "onDeposit", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pay",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setClaimer",
    values: [PromiseOrValue<string>, PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "stakedXINV",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(functionFragment: "xINV", values?: undefined): string;

  decodeFunctionResult(functionFragment: "balance", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "beneficiary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claimDBR", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimDBRTo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimable", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimers", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "delegate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "distributor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "market", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "onDeposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pay", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setClaimer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stakedXINV", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "xINV", data: BytesLike): Result;

  events: {};
}

export interface RewardableEscrow extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RewardableEscrowInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    balance(overrides?: CallOverrides): Promise<[BigNumber]>;

    beneficiary(overrides?: CallOverrides): Promise<[string]>;

    claimDBR(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    claimDBRTo(
      to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    claimable(overrides?: CallOverrides): Promise<[BigNumber]>;

    claimers(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    delegate(
      delegatee: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    distributor(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      _token: PromiseOrValue<string>,
      _beneficiary: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    market(overrides?: CallOverrides): Promise<[string]>;

    onDeposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    pay(
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setClaimer(
      claimer: PromiseOrValue<string>,
      allowed: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    stakedXINV(overrides?: CallOverrides): Promise<[BigNumber]>;

    token(overrides?: CallOverrides): Promise<[string]>;

    xINV(overrides?: CallOverrides): Promise<[string]>;
  };

  balance(overrides?: CallOverrides): Promise<BigNumber>;

  beneficiary(overrides?: CallOverrides): Promise<string>;

  claimDBR(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  claimDBRTo(
    to: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  claimable(overrides?: CallOverrides): Promise<BigNumber>;

  claimers(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  delegate(
    delegatee: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  distributor(overrides?: CallOverrides): Promise<string>;

  initialize(
    _token: PromiseOrValue<string>,
    _beneficiary: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  market(overrides?: CallOverrides): Promise<string>;

  onDeposit(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  pay(
    recipient: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setClaimer(
    claimer: PromiseOrValue<string>,
    allowed: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  stakedXINV(overrides?: CallOverrides): Promise<BigNumber>;

  token(overrides?: CallOverrides): Promise<string>;

  xINV(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    balance(overrides?: CallOverrides): Promise<BigNumber>;

    beneficiary(overrides?: CallOverrides): Promise<string>;

    claimDBR(overrides?: CallOverrides): Promise<void>;

    claimDBRTo(
      to: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    claimable(overrides?: CallOverrides): Promise<BigNumber>;

    claimers(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    delegate(
      delegatee: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    distributor(overrides?: CallOverrides): Promise<string>;

    initialize(
      _token: PromiseOrValue<string>,
      _beneficiary: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    market(overrides?: CallOverrides): Promise<string>;

    onDeposit(overrides?: CallOverrides): Promise<void>;

    pay(
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setClaimer(
      claimer: PromiseOrValue<string>,
      allowed: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    stakedXINV(overrides?: CallOverrides): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<string>;

    xINV(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    balance(overrides?: CallOverrides): Promise<BigNumber>;

    beneficiary(overrides?: CallOverrides): Promise<BigNumber>;

    claimDBR(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    claimDBRTo(
      to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    claimable(overrides?: CallOverrides): Promise<BigNumber>;

    claimers(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    delegate(
      delegatee: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    distributor(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _token: PromiseOrValue<string>,
      _beneficiary: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    market(overrides?: CallOverrides): Promise<BigNumber>;

    onDeposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    pay(
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setClaimer(
      claimer: PromiseOrValue<string>,
      allowed: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    stakedXINV(overrides?: CallOverrides): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    xINV(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    balance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    beneficiary(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimDBR(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    claimDBRTo(
      to: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    claimable(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimers(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    delegate(
      delegatee: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    distributor(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _token: PromiseOrValue<string>,
      _beneficiary: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    market(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    onDeposit(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    pay(
      recipient: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setClaimer(
      claimer: PromiseOrValue<string>,
      allowed: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    stakedXINV(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    xINV(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
