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

export interface BiswapFactoryInterface extends utils.Interface {
  functions: {
    'INIT_CODE_HASH()': FunctionFragment;
    'allPairs(uint256)': FunctionFragment;
    'allPairsLength()': FunctionFragment;
    'createPair(address,address)': FunctionFragment;
    'feeTo()': FunctionFragment;
    'feeToSetter()': FunctionFragment;
    'getPair(address,address)': FunctionFragment;
    'setDevFee(address,uint8)': FunctionFragment;
    'setFeeTo(address)': FunctionFragment;
    'setFeeToSetter(address)': FunctionFragment;
    'setSwapFee(address,uint32)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'INIT_CODE_HASH'
      | 'allPairs'
      | 'allPairsLength'
      | 'createPair'
      | 'feeTo'
      | 'feeToSetter'
      | 'getPair'
      | 'setDevFee'
      | 'setFeeTo'
      | 'setFeeToSetter'
      | 'setSwapFee',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'INIT_CODE_HASH', values?: undefined): string;
  encodeFunctionData(functionFragment: 'allPairs', values: [PromiseOrValue<BigNumberish>]): string;
  encodeFunctionData(functionFragment: 'allPairsLength', values?: undefined): string;
  encodeFunctionData(functionFragment: 'createPair', values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'feeTo', values?: undefined): string;
  encodeFunctionData(functionFragment: 'feeToSetter', values?: undefined): string;
  encodeFunctionData(functionFragment: 'getPair', values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: 'setDevFee',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(functionFragment: 'setFeeTo', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'setFeeToSetter', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: 'setSwapFee',
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;

  decodeFunctionResult(functionFragment: 'INIT_CODE_HASH', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'allPairs', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'allPairsLength', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'createPair', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'feeTo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'feeToSetter', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getPair', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setDevFee', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setFeeTo', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setFeeToSetter', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setSwapFee', data: BytesLike): Result;

  events: {
    'PairCreated(address,address,address,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'PairCreated'): EventFragment;
}

export interface PairCreatedEventObject {
  token0: string;
  token1: string;
  pair: string;
  arg3: BigNumber;
}
export type PairCreatedEvent = TypedEvent<[string, string, string, BigNumber], PairCreatedEventObject>;

export type PairCreatedEventFilter = TypedEventFilter<PairCreatedEvent>;

export interface BiswapFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BiswapFactoryInterface;

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
    INIT_CODE_HASH(overrides?: CallOverrides): Promise<[string]>;

    allPairs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;

    allPairsLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    createPair(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    feeTo(overrides?: CallOverrides): Promise<[string]>;

    feeToSetter(overrides?: CallOverrides): Promise<[string]>;

    getPair(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;

    setDevFee(
      _pair: PromiseOrValue<string>,
      _devFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setFeeTo(
      _feeTo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setFeeToSetter(
      _feeToSetter: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setSwapFee(
      _pair: PromiseOrValue<string>,
      _swapFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;
  };

  INIT_CODE_HASH(overrides?: CallOverrides): Promise<string>;

  allPairs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;

  allPairsLength(overrides?: CallOverrides): Promise<BigNumber>;

  createPair(
    tokenA: PromiseOrValue<string>,
    tokenB: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  feeTo(overrides?: CallOverrides): Promise<string>;

  feeToSetter(overrides?: CallOverrides): Promise<string>;

  getPair(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;

  setDevFee(
    _pair: PromiseOrValue<string>,
    _devFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setFeeTo(
    _feeTo: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setFeeToSetter(
    _feeToSetter: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setSwapFee(
    _pair: PromiseOrValue<string>,
    _swapFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    INIT_CODE_HASH(overrides?: CallOverrides): Promise<string>;

    allPairs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;

    allPairsLength(overrides?: CallOverrides): Promise<BigNumber>;

    createPair(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<string>;

    feeTo(overrides?: CallOverrides): Promise<string>;

    feeToSetter(overrides?: CallOverrides): Promise<string>;

    getPair(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;

    setDevFee(
      _pair: PromiseOrValue<string>,
      _devFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    setFeeTo(_feeTo: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    setFeeToSetter(_feeToSetter: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    setSwapFee(
      _pair: PromiseOrValue<string>,
      _swapFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;
  };

  filters: {
    'PairCreated(address,address,address,uint256)'(
      token0?: PromiseOrValue<string> | null,
      token1?: PromiseOrValue<string> | null,
      pair?: null,
      arg3?: null,
    ): PairCreatedEventFilter;
    PairCreated(
      token0?: PromiseOrValue<string> | null,
      token1?: PromiseOrValue<string> | null,
      pair?: null,
      arg3?: null,
    ): PairCreatedEventFilter;
  };

  estimateGas: {
    INIT_CODE_HASH(overrides?: CallOverrides): Promise<BigNumber>;

    allPairs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;

    allPairsLength(overrides?: CallOverrides): Promise<BigNumber>;

    createPair(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    feeTo(overrides?: CallOverrides): Promise<BigNumber>;

    feeToSetter(overrides?: CallOverrides): Promise<BigNumber>;

    getPair(arg0: PromiseOrValue<string>, arg1: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    setDevFee(
      _pair: PromiseOrValue<string>,
      _devFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setFeeTo(
      _feeTo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setFeeToSetter(
      _feeToSetter: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setSwapFee(
      _pair: PromiseOrValue<string>,
      _swapFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    INIT_CODE_HASH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    allPairs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    allPairsLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    createPair(
      tokenA: PromiseOrValue<string>,
      tokenB: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    feeTo(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    feeToSetter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPair(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    setDevFee(
      _pair: PromiseOrValue<string>,
      _devFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setFeeTo(
      _feeTo: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setFeeToSetter(
      _feeToSetter: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setSwapFee(
      _pair: PromiseOrValue<string>,
      _swapFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;
  };
}
