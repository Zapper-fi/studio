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
import type { FunctionFragment, Result } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from './common';

export interface PancakeswapTokenValidatorInterface extends utils.Interface {
  functions: {
    'batchValidate(address[],address[],uint256)': FunctionFragment;
    'factoryV2()': FunctionFragment;
    'positionManager()': FunctionFragment;
    'uniswapV2Call(address,uint256,uint256,bytes)': FunctionFragment;
    'validate(address,address[],uint256)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: 'batchValidate' | 'factoryV2' | 'positionManager' | 'uniswapV2Call' | 'validate',
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: 'batchValidate',
    values: [PromiseOrValue<string>[], PromiseOrValue<string>[], PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(functionFragment: 'factoryV2', values?: undefined): string;
  encodeFunctionData(functionFragment: 'positionManager', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'uniswapV2Call',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
    ],
  ): string;
  encodeFunctionData(
    functionFragment: 'validate',
    values: [PromiseOrValue<string>, PromiseOrValue<string>[], PromiseOrValue<BigNumberish>],
  ): string;

  decodeFunctionResult(functionFragment: 'batchValidate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'factoryV2', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'positionManager', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'uniswapV2Call', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'validate', data: BytesLike): Result;

  events: {};
}

export interface PancakeswapTokenValidator extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PancakeswapTokenValidatorInterface;

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
    batchValidate(
      tokens: PromiseOrValue<string>[],
      baseTokens: PromiseOrValue<string>[],
      amountToBorrow: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    factoryV2(overrides?: CallOverrides): Promise<[string]>;

    positionManager(overrides?: CallOverrides): Promise<[string]>;

    uniswapV2Call(
      arg0: PromiseOrValue<string>,
      amount0: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<[void]>;

    validate(
      token: PromiseOrValue<string>,
      baseTokens: PromiseOrValue<string>[],
      amountToBorrow: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;
  };

  batchValidate(
    tokens: PromiseOrValue<string>[],
    baseTokens: PromiseOrValue<string>[],
    amountToBorrow: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  factoryV2(overrides?: CallOverrides): Promise<string>;

  positionManager(overrides?: CallOverrides): Promise<string>;

  uniswapV2Call(
    arg0: PromiseOrValue<string>,
    amount0: PromiseOrValue<BigNumberish>,
    arg2: PromiseOrValue<BigNumberish>,
    data: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides,
  ): Promise<void>;

  validate(
    token: PromiseOrValue<string>,
    baseTokens: PromiseOrValue<string>[],
    amountToBorrow: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  callStatic: {
    batchValidate(
      tokens: PromiseOrValue<string>[],
      baseTokens: PromiseOrValue<string>[],
      amountToBorrow: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<number[]>;

    factoryV2(overrides?: CallOverrides): Promise<string>;

    positionManager(overrides?: CallOverrides): Promise<string>;

    uniswapV2Call(
      arg0: PromiseOrValue<string>,
      amount0: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<void>;

    validate(
      token: PromiseOrValue<string>,
      baseTokens: PromiseOrValue<string>[],
      amountToBorrow: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<number>;
  };

  filters: {};

  estimateGas: {
    batchValidate(
      tokens: PromiseOrValue<string>[],
      baseTokens: PromiseOrValue<string>[],
      amountToBorrow: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    factoryV2(overrides?: CallOverrides): Promise<BigNumber>;

    positionManager(overrides?: CallOverrides): Promise<BigNumber>;

    uniswapV2Call(
      arg0: PromiseOrValue<string>,
      amount0: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    validate(
      token: PromiseOrValue<string>,
      baseTokens: PromiseOrValue<string>[],
      amountToBorrow: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    batchValidate(
      tokens: PromiseOrValue<string>[],
      baseTokens: PromiseOrValue<string>[],
      amountToBorrow: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    factoryV2(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    positionManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    uniswapV2Call(
      arg0: PromiseOrValue<string>,
      amount0: PromiseOrValue<BigNumberish>,
      arg2: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    validate(
      token: PromiseOrValue<string>,
      baseTokens: PromiseOrValue<string>[],
      amountToBorrow: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;
  };
}
