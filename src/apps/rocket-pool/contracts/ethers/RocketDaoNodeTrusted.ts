/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from 'ethers';
import type { FunctionFragment, Result } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common';

export interface RocketDaoNodeTrustedInterface extends utils.Interface {
  functions: {
    'getMemberRPLBondAmount(address)': FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: 'getMemberRPLBondAmount'): FunctionFragment;

  encodeFunctionData(functionFragment: 'getMemberRPLBondAmount', values: [string]): string;

  decodeFunctionResult(functionFragment: 'getMemberRPLBondAmount', data: BytesLike): Result;

  events: {};
}

export interface RocketDaoNodeTrusted extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RocketDaoNodeTrustedInterface;

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
    getMemberRPLBondAmount(_nodeAddress: string, overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  getMemberRPLBondAmount(_nodeAddress: string, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    getMemberRPLBondAmount(_nodeAddress: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    getMemberRPLBondAmount(_nodeAddress: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getMemberRPLBondAmount(_nodeAddress: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
