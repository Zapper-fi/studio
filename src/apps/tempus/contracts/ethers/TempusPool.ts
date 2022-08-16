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
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from './common';

export type TokenDataStruct = {
  name: PromiseOrValue<string>;
  symbol: PromiseOrValue<string>;
};

export type TokenDataStructOutput = [string, string] & {
  name: string;
  symbol: string;
};

export declare namespace ITempusFees {
  export type FeesConfigStruct = {
    depositPercent: PromiseOrValue<BigNumberish>;
    earlyRedeemPercent: PromiseOrValue<BigNumberish>;
    matureRedeemPercent: PromiseOrValue<BigNumberish>;
  };

  export type FeesConfigStructOutput = [BigNumber, BigNumber, BigNumber] & {
    depositPercent: BigNumber;
    earlyRedeemPercent: BigNumber;
    matureRedeemPercent: BigNumber;
  };
}

export declare namespace IVersioned {
  export type VersionStruct = {
    major: PromiseOrValue<BigNumberish>;
    minor: PromiseOrValue<BigNumberish>;
    patch: PromiseOrValue<BigNumberish>;
  };

  export type VersionStructOutput = [number, number, number] & {
    major: number;
    minor: number;
    patch: number;
  };
}

export interface TempusPoolInterface extends utils.Interface {
  functions: {
    'acceptOwnership()': FunctionFragment;
    'backingToken()': FunctionFragment;
    'backingTokenONE()': FunctionFragment;
    'controller()': FunctionFragment;
    'currentInterestRate()': FunctionFragment;
    'estimatedMintedShares(uint256,bool)': FunctionFragment;
    'estimatedRedeem(uint256,uint256,bool)': FunctionFragment;
    'exceptionalHaltTime()': FunctionFragment;
    'exchangeRateONE()': FunctionFragment;
    'finalize()': FunctionFragment;
    'getFeesConfig()': FunctionFragment;
    'initialInterestRate()': FunctionFragment;
    'matured()': FunctionFragment;
    'maturityInterestRate()': FunctionFragment;
    'maturityTime()': FunctionFragment;
    'maxDepositFee()': FunctionFragment;
    'maxEarlyRedeemFee()': FunctionFragment;
    'maxMatureRedeemFee()': FunctionFragment;
    'maximumNegativeYieldDuration()': FunctionFragment;
    'numAssetsPerYieldToken(uint256,uint256)': FunctionFragment;
    'numYieldTokensPerAsset(uint256,uint256)': FunctionFragment;
    'onDepositBacking(uint256,address)': FunctionFragment;
    'onDepositYieldBearing(uint256,address)': FunctionFragment;
    'owner()': FunctionFragment;
    'pricePerPrincipalShare()': FunctionFragment;
    'pricePerPrincipalShareStored()': FunctionFragment;
    'pricePerYieldShare()': FunctionFragment;
    'pricePerYieldShareStored()': FunctionFragment;
    'principalShare()': FunctionFragment;
    'protocolName()': FunctionFragment;
    'redeem(address,uint256,uint256,address)': FunctionFragment;
    'redeemToBacking(address,uint256,uint256,address)': FunctionFragment;
    'setFeesConfig((uint256,uint256,uint256))': FunctionFragment;
    'startTime()': FunctionFragment;
    'totalFees()': FunctionFragment;
    'transferFees(address)': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
    'version()': FunctionFragment;
    'yieldBearingONE()': FunctionFragment;
    'yieldBearingToken()': FunctionFragment;
    'yieldShare()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'acceptOwnership'
      | 'backingToken'
      | 'backingTokenONE'
      | 'controller'
      | 'currentInterestRate'
      | 'estimatedMintedShares'
      | 'estimatedRedeem'
      | 'exceptionalHaltTime'
      | 'exchangeRateONE'
      | 'finalize'
      | 'getFeesConfig'
      | 'initialInterestRate'
      | 'matured'
      | 'maturityInterestRate'
      | 'maturityTime'
      | 'maxDepositFee'
      | 'maxEarlyRedeemFee'
      | 'maxMatureRedeemFee'
      | 'maximumNegativeYieldDuration'
      | 'numAssetsPerYieldToken'
      | 'numYieldTokensPerAsset'
      | 'onDepositBacking'
      | 'onDepositYieldBearing'
      | 'owner'
      | 'pricePerPrincipalShare'
      | 'pricePerPrincipalShareStored'
      | 'pricePerYieldShare'
      | 'pricePerYieldShareStored'
      | 'principalShare'
      | 'protocolName'
      | 'redeem'
      | 'redeemToBacking'
      | 'setFeesConfig'
      | 'startTime'
      | 'totalFees'
      | 'transferFees'
      | 'transferOwnership'
      | 'version'
      | 'yieldBearingONE'
      | 'yieldBearingToken'
      | 'yieldShare',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'acceptOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'backingToken', values?: undefined): string;
  encodeFunctionData(functionFragment: 'backingTokenONE', values?: undefined): string;
  encodeFunctionData(functionFragment: 'controller', values?: undefined): string;
  encodeFunctionData(functionFragment: 'currentInterestRate', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'estimatedMintedShares',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<boolean>],
  ): string;
  encodeFunctionData(
    functionFragment: 'estimatedRedeem',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>, PromiseOrValue<boolean>],
  ): string;
  encodeFunctionData(functionFragment: 'exceptionalHaltTime', values?: undefined): string;
  encodeFunctionData(functionFragment: 'exchangeRateONE', values?: undefined): string;
  encodeFunctionData(functionFragment: 'finalize', values?: undefined): string;
  encodeFunctionData(functionFragment: 'getFeesConfig', values?: undefined): string;
  encodeFunctionData(functionFragment: 'initialInterestRate', values?: undefined): string;
  encodeFunctionData(functionFragment: 'matured', values?: undefined): string;
  encodeFunctionData(functionFragment: 'maturityInterestRate', values?: undefined): string;
  encodeFunctionData(functionFragment: 'maturityTime', values?: undefined): string;
  encodeFunctionData(functionFragment: 'maxDepositFee', values?: undefined): string;
  encodeFunctionData(functionFragment: 'maxEarlyRedeemFee', values?: undefined): string;
  encodeFunctionData(functionFragment: 'maxMatureRedeemFee', values?: undefined): string;
  encodeFunctionData(functionFragment: 'maximumNegativeYieldDuration', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'numAssetsPerYieldToken',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: 'numYieldTokensPerAsset',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
  ): string;
  encodeFunctionData(
    functionFragment: 'onDepositBacking',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: 'onDepositYieldBearing',
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pricePerPrincipalShare', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pricePerPrincipalShareStored', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pricePerYieldShare', values?: undefined): string;
  encodeFunctionData(functionFragment: 'pricePerYieldShareStored', values?: undefined): string;
  encodeFunctionData(functionFragment: 'principalShare', values?: undefined): string;
  encodeFunctionData(functionFragment: 'protocolName', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'redeem',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
    ],
  ): string;
  encodeFunctionData(
    functionFragment: 'redeemToBacking',
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
    ],
  ): string;
  encodeFunctionData(functionFragment: 'setFeesConfig', values: [ITempusFees.FeesConfigStruct]): string;
  encodeFunctionData(functionFragment: 'startTime', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalFees', values?: undefined): string;
  encodeFunctionData(functionFragment: 'transferFees', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'version', values?: undefined): string;
  encodeFunctionData(functionFragment: 'yieldBearingONE', values?: undefined): string;
  encodeFunctionData(functionFragment: 'yieldBearingToken', values?: undefined): string;
  encodeFunctionData(functionFragment: 'yieldShare', values?: undefined): string;

  decodeFunctionResult(functionFragment: 'acceptOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'backingToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'backingTokenONE', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'controller', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'currentInterestRate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'estimatedMintedShares', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'estimatedRedeem', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'exceptionalHaltTime', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'exchangeRateONE', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'finalize', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getFeesConfig', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'initialInterestRate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'matured', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'maturityInterestRate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'maturityTime', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'maxDepositFee', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'maxEarlyRedeemFee', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'maxMatureRedeemFee', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'maximumNegativeYieldDuration', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'numAssetsPerYieldToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'numYieldTokensPerAsset', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'onDepositBacking', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'onDepositYieldBearing', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pricePerPrincipalShare', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pricePerPrincipalShareStored', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pricePerYieldShare', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'pricePerYieldShareStored', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'principalShare', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'protocolName', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'redeem', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'redeemToBacking', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setFeesConfig', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'startTime', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalFees', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferFees', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'version', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'yieldBearingONE', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'yieldBearingToken', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'yieldShare', data: BytesLike): Result;

  events: {
    'OwnershipProposed(address,address)': EventFragment;
    'OwnershipTransferred(address,address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'OwnershipProposed'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
}

export interface OwnershipProposedEventObject {
  currentOwner: string;
  proposedOwner: string;
}
export type OwnershipProposedEvent = TypedEvent<[string, string], OwnershipProposedEventObject>;

export type OwnershipProposedEventFilter = TypedEventFilter<OwnershipProposedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[string, string], OwnershipTransferredEventObject>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface TempusPool extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TempusPoolInterface;

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
    acceptOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    backingToken(overrides?: CallOverrides): Promise<[string]>;

    backingTokenONE(overrides?: CallOverrides): Promise<[BigNumber]>;

    controller(overrides?: CallOverrides): Promise<[string]>;

    currentInterestRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    estimatedMintedShares(
      amount: PromiseOrValue<BigNumberish>,
      isBackingToken: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    estimatedRedeem(
      principals: PromiseOrValue<BigNumberish>,
      yields: PromiseOrValue<BigNumberish>,
      toBackingToken: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    exceptionalHaltTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    exchangeRateONE(overrides?: CallOverrides): Promise<[BigNumber]>;

    finalize(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    getFeesConfig(overrides?: CallOverrides): Promise<[ITempusFees.FeesConfigStructOutput]>;

    initialInterestRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    matured(overrides?: CallOverrides): Promise<[boolean]>;

    maturityInterestRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    maturityTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxDepositFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxEarlyRedeemFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxMatureRedeemFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    maximumNegativeYieldDuration(overrides?: CallOverrides): Promise<[BigNumber]>;

    numAssetsPerYieldToken(
      yieldTokens: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    numYieldTokensPerAsset(
      backingTokens: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    onDepositBacking(
      backingTokenAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    onDepositYieldBearing(
      yieldTokenAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pricePerPrincipalShare(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    pricePerPrincipalShareStored(overrides?: CallOverrides): Promise<[BigNumber]>;

    pricePerYieldShare(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

    pricePerYieldShareStored(overrides?: CallOverrides): Promise<[BigNumber]>;

    principalShare(overrides?: CallOverrides): Promise<[string]>;

    protocolName(overrides?: CallOverrides): Promise<[string]>;

    redeem(
      from: PromiseOrValue<string>,
      principalAmount: PromiseOrValue<BigNumberish>,
      yieldAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    redeemToBacking(
      from: PromiseOrValue<string>,
      principalAmount: PromiseOrValue<BigNumberish>,
      yieldAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    setFeesConfig(
      newFeesConfig: ITempusFees.FeesConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    startTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalFees(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferFees(
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<ContractTransaction>;

    version(overrides?: CallOverrides): Promise<[IVersioned.VersionStructOutput]>;

    yieldBearingONE(overrides?: CallOverrides): Promise<[BigNumber]>;

    yieldBearingToken(overrides?: CallOverrides): Promise<[string]>;

    yieldShare(overrides?: CallOverrides): Promise<[string]>;
  };

  acceptOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  backingToken(overrides?: CallOverrides): Promise<string>;

  backingTokenONE(overrides?: CallOverrides): Promise<BigNumber>;

  controller(overrides?: CallOverrides): Promise<string>;

  currentInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

  estimatedMintedShares(
    amount: PromiseOrValue<BigNumberish>,
    isBackingToken: PromiseOrValue<boolean>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  estimatedRedeem(
    principals: PromiseOrValue<BigNumberish>,
    yields: PromiseOrValue<BigNumberish>,
    toBackingToken: PromiseOrValue<boolean>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  exceptionalHaltTime(overrides?: CallOverrides): Promise<BigNumber>;

  exchangeRateONE(overrides?: CallOverrides): Promise<BigNumber>;

  finalize(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  getFeesConfig(overrides?: CallOverrides): Promise<ITempusFees.FeesConfigStructOutput>;

  initialInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

  matured(overrides?: CallOverrides): Promise<boolean>;

  maturityInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

  maturityTime(overrides?: CallOverrides): Promise<BigNumber>;

  maxDepositFee(overrides?: CallOverrides): Promise<BigNumber>;

  maxEarlyRedeemFee(overrides?: CallOverrides): Promise<BigNumber>;

  maxMatureRedeemFee(overrides?: CallOverrides): Promise<BigNumber>;

  maximumNegativeYieldDuration(overrides?: CallOverrides): Promise<BigNumber>;

  numAssetsPerYieldToken(
    yieldTokens: PromiseOrValue<BigNumberish>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  numYieldTokensPerAsset(
    backingTokens: PromiseOrValue<BigNumberish>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  onDepositBacking(
    backingTokenAmount: PromiseOrValue<BigNumberish>,
    recipient: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  onDepositYieldBearing(
    yieldTokenAmount: PromiseOrValue<BigNumberish>,
    recipient: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  pricePerPrincipalShare(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  pricePerPrincipalShareStored(overrides?: CallOverrides): Promise<BigNumber>;

  pricePerYieldShare(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<ContractTransaction>;

  pricePerYieldShareStored(overrides?: CallOverrides): Promise<BigNumber>;

  principalShare(overrides?: CallOverrides): Promise<string>;

  protocolName(overrides?: CallOverrides): Promise<string>;

  redeem(
    from: PromiseOrValue<string>,
    principalAmount: PromiseOrValue<BigNumberish>,
    yieldAmount: PromiseOrValue<BigNumberish>,
    recipient: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  redeemToBacking(
    from: PromiseOrValue<string>,
    principalAmount: PromiseOrValue<BigNumberish>,
    yieldAmount: PromiseOrValue<BigNumberish>,
    recipient: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  setFeesConfig(
    newFeesConfig: ITempusFees.FeesConfigStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  startTime(overrides?: CallOverrides): Promise<BigNumber>;

  totalFees(overrides?: CallOverrides): Promise<BigNumber>;

  transferFees(
    recipient: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<ContractTransaction>;

  version(overrides?: CallOverrides): Promise<IVersioned.VersionStructOutput>;

  yieldBearingONE(overrides?: CallOverrides): Promise<BigNumber>;

  yieldBearingToken(overrides?: CallOverrides): Promise<string>;

  yieldShare(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    acceptOwnership(overrides?: CallOverrides): Promise<void>;

    backingToken(overrides?: CallOverrides): Promise<string>;

    backingTokenONE(overrides?: CallOverrides): Promise<BigNumber>;

    controller(overrides?: CallOverrides): Promise<string>;

    currentInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

    estimatedMintedShares(
      amount: PromiseOrValue<BigNumberish>,
      isBackingToken: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    estimatedRedeem(
      principals: PromiseOrValue<BigNumberish>,
      yields: PromiseOrValue<BigNumberish>,
      toBackingToken: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    exceptionalHaltTime(overrides?: CallOverrides): Promise<BigNumber>;

    exchangeRateONE(overrides?: CallOverrides): Promise<BigNumber>;

    finalize(overrides?: CallOverrides): Promise<void>;

    getFeesConfig(overrides?: CallOverrides): Promise<ITempusFees.FeesConfigStructOutput>;

    initialInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

    matured(overrides?: CallOverrides): Promise<boolean>;

    maturityInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

    maturityTime(overrides?: CallOverrides): Promise<BigNumber>;

    maxDepositFee(overrides?: CallOverrides): Promise<BigNumber>;

    maxEarlyRedeemFee(overrides?: CallOverrides): Promise<BigNumber>;

    maxMatureRedeemFee(overrides?: CallOverrides): Promise<BigNumber>;

    maximumNegativeYieldDuration(overrides?: CallOverrides): Promise<BigNumber>;

    numAssetsPerYieldToken(
      yieldTokens: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    numYieldTokensPerAsset(
      backingTokens: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    onDepositBacking(
      backingTokenAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        mintedShares: BigNumber;
        depositedYBT: BigNumber;
        fee: BigNumber;
        rate: BigNumber;
      }
    >;

    onDepositYieldBearing(
      yieldTokenAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        mintedShares: BigNumber;
        depositedBT: BigNumber;
        fee: BigNumber;
        rate: BigNumber;
      }
    >;

    owner(overrides?: CallOverrides): Promise<string>;

    pricePerPrincipalShare(overrides?: CallOverrides): Promise<BigNumber>;

    pricePerPrincipalShareStored(overrides?: CallOverrides): Promise<BigNumber>;

    pricePerYieldShare(overrides?: CallOverrides): Promise<BigNumber>;

    pricePerYieldShareStored(overrides?: CallOverrides): Promise<BigNumber>;

    principalShare(overrides?: CallOverrides): Promise<string>;

    protocolName(overrides?: CallOverrides): Promise<string>;

    redeem(
      from: PromiseOrValue<string>,
      principalAmount: PromiseOrValue<BigNumberish>,
      yieldAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        redeemedYieldTokens: BigNumber;
        fee: BigNumber;
        rate: BigNumber;
      }
    >;

    redeemToBacking(
      from: PromiseOrValue<string>,
      principalAmount: PromiseOrValue<BigNumberish>,
      yieldAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        redeemedYieldTokens: BigNumber;
        redeemedBackingTokens: BigNumber;
        fee: BigNumber;
        rate: BigNumber;
      }
    >;

    setFeesConfig(newFeesConfig: ITempusFees.FeesConfigStruct, overrides?: CallOverrides): Promise<void>;

    startTime(overrides?: CallOverrides): Promise<BigNumber>;

    totalFees(overrides?: CallOverrides): Promise<BigNumber>;

    transferFees(recipient: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;

    version(overrides?: CallOverrides): Promise<IVersioned.VersionStructOutput>;

    yieldBearingONE(overrides?: CallOverrides): Promise<BigNumber>;

    yieldBearingToken(overrides?: CallOverrides): Promise<string>;

    yieldShare(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    'OwnershipProposed(address,address)'(
      currentOwner?: PromiseOrValue<string> | null,
      proposedOwner?: PromiseOrValue<string> | null,
    ): OwnershipProposedEventFilter;
    OwnershipProposed(
      currentOwner?: PromiseOrValue<string> | null,
      proposedOwner?: PromiseOrValue<string> | null,
    ): OwnershipProposedEventFilter;

    'OwnershipTransferred(address,address)'(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null,
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    acceptOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    backingToken(overrides?: CallOverrides): Promise<BigNumber>;

    backingTokenONE(overrides?: CallOverrides): Promise<BigNumber>;

    controller(overrides?: CallOverrides): Promise<BigNumber>;

    currentInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

    estimatedMintedShares(
      amount: PromiseOrValue<BigNumberish>,
      isBackingToken: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    estimatedRedeem(
      principals: PromiseOrValue<BigNumberish>,
      yields: PromiseOrValue<BigNumberish>,
      toBackingToken: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    exceptionalHaltTime(overrides?: CallOverrides): Promise<BigNumber>;

    exchangeRateONE(overrides?: CallOverrides): Promise<BigNumber>;

    finalize(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    getFeesConfig(overrides?: CallOverrides): Promise<BigNumber>;

    initialInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

    matured(overrides?: CallOverrides): Promise<BigNumber>;

    maturityInterestRate(overrides?: CallOverrides): Promise<BigNumber>;

    maturityTime(overrides?: CallOverrides): Promise<BigNumber>;

    maxDepositFee(overrides?: CallOverrides): Promise<BigNumber>;

    maxEarlyRedeemFee(overrides?: CallOverrides): Promise<BigNumber>;

    maxMatureRedeemFee(overrides?: CallOverrides): Promise<BigNumber>;

    maximumNegativeYieldDuration(overrides?: CallOverrides): Promise<BigNumber>;

    numAssetsPerYieldToken(
      yieldTokens: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    numYieldTokensPerAsset(
      backingTokens: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    onDepositBacking(
      backingTokenAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    onDepositYieldBearing(
      yieldTokenAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pricePerPrincipalShare(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    pricePerPrincipalShareStored(overrides?: CallOverrides): Promise<BigNumber>;

    pricePerYieldShare(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<BigNumber>;

    pricePerYieldShareStored(overrides?: CallOverrides): Promise<BigNumber>;

    principalShare(overrides?: CallOverrides): Promise<BigNumber>;

    protocolName(overrides?: CallOverrides): Promise<BigNumber>;

    redeem(
      from: PromiseOrValue<string>,
      principalAmount: PromiseOrValue<BigNumberish>,
      yieldAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    redeemToBacking(
      from: PromiseOrValue<string>,
      principalAmount: PromiseOrValue<BigNumberish>,
      yieldAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    setFeesConfig(
      newFeesConfig: ITempusFees.FeesConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    startTime(overrides?: CallOverrides): Promise<BigNumber>;

    totalFees(overrides?: CallOverrides): Promise<BigNumber>;

    transferFees(
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<BigNumber>;

    version(overrides?: CallOverrides): Promise<BigNumber>;

    yieldBearingONE(overrides?: CallOverrides): Promise<BigNumber>;

    yieldBearingToken(overrides?: CallOverrides): Promise<BigNumber>;

    yieldShare(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    acceptOwnership(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    backingToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    backingTokenONE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    controller(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    currentInterestRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    estimatedMintedShares(
      amount: PromiseOrValue<BigNumberish>,
      isBackingToken: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    estimatedRedeem(
      principals: PromiseOrValue<BigNumberish>,
      yields: PromiseOrValue<BigNumberish>,
      toBackingToken: PromiseOrValue<boolean>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    exceptionalHaltTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    exchangeRateONE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    finalize(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    getFeesConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialInterestRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    matured(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maturityInterestRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maturityTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxDepositFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxEarlyRedeemFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxMatureRedeemFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maximumNegativeYieldDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    numAssetsPerYieldToken(
      yieldTokens: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    numYieldTokensPerAsset(
      backingTokens: PromiseOrValue<BigNumberish>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    onDepositBacking(
      backingTokenAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    onDepositYieldBearing(
      yieldTokenAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pricePerPrincipalShare(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    pricePerPrincipalShareStored(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pricePerYieldShare(overrides?: Overrides & { from?: PromiseOrValue<string> }): Promise<PopulatedTransaction>;

    pricePerYieldShareStored(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    principalShare(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    protocolName(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    redeem(
      from: PromiseOrValue<string>,
      principalAmount: PromiseOrValue<BigNumberish>,
      yieldAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    redeemToBacking(
      from: PromiseOrValue<string>,
      principalAmount: PromiseOrValue<BigNumberish>,
      yieldAmount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    setFeesConfig(
      newFeesConfig: ITempusFees.FeesConfigStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    startTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalFees(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferFees(
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> },
    ): Promise<PopulatedTransaction>;

    version(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    yieldBearingONE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    yieldBearingToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    yieldShare(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
