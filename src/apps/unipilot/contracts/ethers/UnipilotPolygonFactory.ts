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

export interface UnipilotPolygonFactoryInterface extends utils.Interface {
  functions: {
    'createVault(address,address,uint24,uint16,uint160,string,string)': FunctionFragment;
    'getUnipilotDetails()': FunctionFragment;
    'isWhitelist(address)': FunctionFragment;
    'setGovernance(address)': FunctionFragment;
    'setUnipilotDetails(address,address,uint8)': FunctionFragment;
    'toggleWhitelistAccount(address)': FunctionFragment;
    'vaults(address,address,uint24,uint16)': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'createVault'
      | 'getUnipilotDetails'
      | 'isWhitelist'
      | 'setGovernance'
      | 'setUnipilotDetails'
      | 'toggleWhitelistAccount'
      | 'vaults',
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: 'createVault',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
    ],
  ): string;
  encodeFunctionData(functionFragment: 'getUnipilotDetails', values?: undefined): string;
  encodeFunctionData(functionFragment: 'isWhitelist', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'setGovernance', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: 'setUnipilotDetails',
    values: [PromiseOrValue<string>, PromiseOrValue<string>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(functionFragment: 'toggleWhitelistAccount', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: 'vaults',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
    ],
  ): string;

  decodeFunctionResult(functionFragment: 'createVault', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getUnipilotDetails', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'isWhitelist', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setGovernance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setUnipilotDetails', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'toggleWhitelistAccount', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'vaults', data: BytesLike): Result;

  events: {
    'GovernanceChanged(address,address)': EventFragment;
    'VaultCreated(address,address,uint16,uint24,address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'GovernanceChanged'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'VaultCreated'): EventFragment;
}

export interface GovernanceChangedEventObject {
  _oldGovernance: string;
  _newGovernance: string;
}
export type GovernanceChangedEvent = TypedEvent<[string, string], GovernanceChangedEventObject>;

export type GovernanceChangedEventFilter = TypedEventFilter<GovernanceChangedEvent>;

export interface VaultCreatedEventObject {
  _tokenA: string;
  _tokenB: string;
  _strategyType: number;
  _fee: number;
  _vault: string;
}
export type VaultCreatedEvent = TypedEvent<[string, string, number, number, string], VaultCreatedEventObject>;

export type VaultCreatedEventFilter = TypedEventFilter<VaultCreatedEvent>;

export interface UnipilotPolygonFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UnipilotPolygonFactoryInterface;

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
    createVault(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _fee: PromiseOrValue<BigNumberish>,
      _vaultStrategy: PromiseOrValue<BigNumberish>,
      _sqrtPriceX96: PromiseOrValue<BigNumberish>,
      _name: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    getUnipilotDetails(overrides?: CallOverrides): Promise<[string, string, string, number, number]>;

    isWhitelist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;

    setGovernance(
      _newGovernance: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setUnipilotDetails(
      _strategy: PromiseOrValue<string>,
      _indexFund: PromiseOrValue<string>,
      _indexFundPercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    toggleWhitelistAccount(
      _address: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    vaults(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[string]>;
  };

  createVault(
    _tokenA: PromiseOrValue<string>,
    _tokenB: PromiseOrValue<string>,
    _fee: PromiseOrValue<BigNumberish>,
    _vaultStrategy: PromiseOrValue<BigNumberish>,
    _sqrtPriceX96: PromiseOrValue<BigNumberish>,
    _name: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  getUnipilotDetails(overrides?: CallOverrides): Promise<[string, string, string, number, number]>;

  isWhitelist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;

  setGovernance(
    _newGovernance: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setUnipilotDetails(
    _strategy: PromiseOrValue<string>,
    _indexFund: PromiseOrValue<string>,
    _indexFundPercentage: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  toggleWhitelistAccount(
    _address: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  vaults(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    arg2: PromiseOrValue<BigNumberish>,
    arg3: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<string>;

  callStatic: {
    createVault(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _fee: PromiseOrValue<BigNumberish>,
      _vaultStrategy: PromiseOrValue<BigNumberish>,
      _sqrtPriceX96: PromiseOrValue<BigNumberish>,
      _name: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<string>;

    getUnipilotDetails(overrides?: CallOverrides): Promise<[string, string, string, number, number]>;

    isWhitelist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;

    setGovernance(_newGovernance: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    setUnipilotDetails(
      _strategy: PromiseOrValue<string>,
      _indexFund: PromiseOrValue<string>,
      _indexFundPercentage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<void>;

    toggleWhitelistAccount(_address: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    vaults(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<string>;
  };

  filters: {
    'GovernanceChanged(address,address)'(
      _oldGovernance?: PromiseOrValue<string> | null,
      _newGovernance?: PromiseOrValue<string> | null,
    ): GovernanceChangedEventFilter;
    GovernanceChanged(
      _oldGovernance?: PromiseOrValue<string> | null,
      _newGovernance?: PromiseOrValue<string> | null,
    ): GovernanceChangedEventFilter;

    'VaultCreated(address,address,uint16,uint24,address)'(
      _tokenA?: PromiseOrValue<string> | null,
      _tokenB?: PromiseOrValue<string> | null,
      _strategyType?: null,
      _fee?: null,
      _vault?: PromiseOrValue<string> | null,
    ): VaultCreatedEventFilter;
    VaultCreated(
      _tokenA?: PromiseOrValue<string> | null,
      _tokenB?: PromiseOrValue<string> | null,
      _strategyType?: null,
      _fee?: null,
      _vault?: PromiseOrValue<string> | null,
    ): VaultCreatedEventFilter;
  };

  estimateGas: {
    createVault(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _fee: PromiseOrValue<BigNumberish>,
      _vaultStrategy: PromiseOrValue<BigNumberish>,
      _sqrtPriceX96: PromiseOrValue<BigNumberish>,
      _name: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    getUnipilotDetails(overrides?: CallOverrides): Promise<BigNumber>;

    isWhitelist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    setGovernance(
      _newGovernance: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setUnipilotDetails(
      _strategy: PromiseOrValue<string>,
      _indexFund: PromiseOrValue<string>,
      _indexFundPercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    toggleWhitelistAccount(
      _address: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    vaults(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createVault(
      _tokenA: PromiseOrValue<string>,
      _tokenB: PromiseOrValue<string>,
      _fee: PromiseOrValue<BigNumberish>,
      _vaultStrategy: PromiseOrValue<BigNumberish>,
      _sqrtPriceX96: PromiseOrValue<BigNumberish>,
      _name: PromiseOrValue<string>,
      _symbol: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    getUnipilotDetails(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isWhitelist(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setGovernance(
      _newGovernance: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setUnipilotDetails(
      _strategy: PromiseOrValue<string>,
      _indexFund: PromiseOrValue<string>,
      _indexFundPercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    toggleWhitelistAccount(
      _address: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    vaults(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      arg2: PromiseOrValue<BigNumberish>,
      arg3: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };
}
