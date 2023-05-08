/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers';
import type { FunctionFragment, Result } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from './common';

export declare namespace MarketLens {
  export type AmountValueStruct = {
    amount: PromiseOrValue<BigNumberish>;
    value: PromiseOrValue<BigNumberish>;
  };

  export type AmountValueStructOutput = [BigNumber, BigNumber] & {
    amount: BigNumber;
    value: BigNumber;
  };

  export type MarketInfoStruct = {
    cauldron: PromiseOrValue<string>;
    borrowFee: PromiseOrValue<BigNumberish>;
    maximumCollateralRatio: PromiseOrValue<BigNumberish>;
    liquidationFee: PromiseOrValue<BigNumberish>;
    interestPerYear: PromiseOrValue<BigNumberish>;
    marketMaxBorrow: PromiseOrValue<BigNumberish>;
    userMaxBorrow: PromiseOrValue<BigNumberish>;
    totalBorrowed: PromiseOrValue<BigNumberish>;
    oracleExchangeRate: PromiseOrValue<BigNumberish>;
    collateralPrice: PromiseOrValue<BigNumberish>;
    totalCollateral: MarketLens.AmountValueStruct;
  };

  export type MarketInfoStructOutput = [
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    MarketLens.AmountValueStructOutput,
  ] & {
    cauldron: string;
    borrowFee: BigNumber;
    maximumCollateralRatio: BigNumber;
    liquidationFee: BigNumber;
    interestPerYear: BigNumber;
    marketMaxBorrow: BigNumber;
    userMaxBorrow: BigNumber;
    totalBorrowed: BigNumber;
    oracleExchangeRate: BigNumber;
    collateralPrice: BigNumber;
    totalCollateral: MarketLens.AmountValueStructOutput;
  };

  export type UserPositionStruct = {
    cauldron: PromiseOrValue<string>;
    account: PromiseOrValue<string>;
    ltvBps: PromiseOrValue<BigNumberish>;
    healthFactor: PromiseOrValue<BigNumberish>;
    borrowValue: PromiseOrValue<BigNumberish>;
    collateral: MarketLens.AmountValueStruct;
    liquidationPrice: PromiseOrValue<BigNumberish>;
  };

  export type UserPositionStructOutput = [
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    MarketLens.AmountValueStructOutput,
    BigNumber,
  ] & {
    cauldron: string;
    account: string;
    ltvBps: BigNumber;
    healthFactor: BigNumber;
    borrowValue: BigNumber;
    collateral: MarketLens.AmountValueStructOutput;
    liquidationPrice: BigNumber;
  };
}

export interface AbracadabraMarketLensInterface extends utils.Interface {
  functions: {
    'getBorrowFee(address)': FunctionFragment;
    'getCollateralPrice(address)': FunctionFragment;
    'getHealthFactor(address,address)': FunctionFragment;
    'getInterestPerYear(address)': FunctionFragment;
    'getLiquidationFee(address)': FunctionFragment;
    'getMarketInfoCauldronV2(address)': FunctionFragment;
    'getMarketInfoCauldronV3(address)': FunctionFragment;
    'getMaxMarketBorrowForCauldronV2(address)': FunctionFragment;
    'getMaxMarketBorrowForCauldronV3(address)': FunctionFragment;
    'getMaxUserBorrowForCauldronV2(address)': FunctionFragment;
    'getMaxUserBorrowForCauldronV3(address)': FunctionFragment;
    'getMaximumCollateralRatio(address)': FunctionFragment;
    'getOracleExchangeRate(address)': FunctionFragment;
    'getTokenInBentoBox(address,address,address)': FunctionFragment;
    'getTotalBorrowed(address)': FunctionFragment;
    'getTotalCollateral(address)': FunctionFragment;
    'getUserBorrow(address,address)': FunctionFragment;
    'getUserCollateral(address,address)': FunctionFragment;
    'getUserLiquidationPrice(address,address)': FunctionFragment;
    'getUserLtv(address,address)': FunctionFragment;
    'getUserMaxBorrow(address,address)': FunctionFragment;
    'getUserPosition(address,address)': FunctionFragment;
    'getUserPositions(address,address[])': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'getBorrowFee'
      | 'getCollateralPrice'
      | 'getHealthFactor'
      | 'getInterestPerYear'
      | 'getLiquidationFee'
      | 'getMarketInfoCauldronV2'
      | 'getMarketInfoCauldronV3'
      | 'getMaxMarketBorrowForCauldronV2'
      | 'getMaxMarketBorrowForCauldronV3'
      | 'getMaxUserBorrowForCauldronV2'
      | 'getMaxUserBorrowForCauldronV3'
      | 'getMaximumCollateralRatio'
      | 'getOracleExchangeRate'
      | 'getTokenInBentoBox'
      | 'getTotalBorrowed'
      | 'getTotalCollateral'
      | 'getUserBorrow'
      | 'getUserCollateral'
      | 'getUserLiquidationPrice'
      | 'getUserLtv'
      | 'getUserMaxBorrow'
      | 'getUserPosition'
      | 'getUserPositions',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'getBorrowFee', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'getCollateralPrice', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: 'getHealthFactor',
    values: [PromiseOrValue<string>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(functionFragment: 'getInterestPerYear', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'getLiquidationFee', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'getMarketInfoCauldronV2', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'getMarketInfoCauldronV3', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'getMaxMarketBorrowForCauldronV2', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'getMaxMarketBorrowForCauldronV3', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'getMaxUserBorrowForCauldronV2', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'getMaxUserBorrowForCauldronV3', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'getMaximumCollateralRatio', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'getOracleExchangeRate', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: 'getTokenInBentoBox',
    values: [PromiseOrValue<string>, PromiseOrValue<string>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(functionFragment: 'getTotalBorrowed', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(functionFragment: 'getTotalCollateral', values: [PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: 'getUserBorrow',
    values: [PromiseOrValue<string>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: 'getUserCollateral',
    values: [PromiseOrValue<string>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: 'getUserLiquidationPrice',
    values: [PromiseOrValue<string>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(functionFragment: 'getUserLtv', values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
  encodeFunctionData(
    functionFragment: 'getUserMaxBorrow',
    values: [PromiseOrValue<string>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: 'getUserPosition',
    values: [PromiseOrValue<string>, PromiseOrValue<string>],
  ): string;
  encodeFunctionData(
    functionFragment: 'getUserPositions',
    values: [PromiseOrValue<string>, PromiseOrValue<string>[]],
  ): string;

  decodeFunctionResult(functionFragment: 'getBorrowFee', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getCollateralPrice', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getHealthFactor', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getInterestPerYear', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getLiquidationFee', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getMarketInfoCauldronV2', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getMarketInfoCauldronV3', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getMaxMarketBorrowForCauldronV2', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getMaxMarketBorrowForCauldronV3', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getMaxUserBorrowForCauldronV2', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getMaxUserBorrowForCauldronV3', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getMaximumCollateralRatio', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getOracleExchangeRate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getTokenInBentoBox', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getTotalBorrowed', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getTotalCollateral', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getUserBorrow', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getUserCollateral', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getUserLiquidationPrice', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getUserLtv', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getUserMaxBorrow', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getUserPosition', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getUserPositions', data: BytesLike): Result;

  events: {};
}

export interface AbracadabraMarketLens extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AbracadabraMarketLensInterface;

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
    getBorrowFee(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    getCollateralPrice(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    getHealthFactor(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { healthFactor: BigNumber }>;

    getInterestPerYear(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    getLiquidationFee(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    getMarketInfoCauldronV2(
      cauldron: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[MarketLens.MarketInfoStructOutput]>;

    getMarketInfoCauldronV3(
      cauldron: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<
      [MarketLens.MarketInfoStructOutput] & {
        marketInfo: MarketLens.MarketInfoStructOutput;
      }
    >;

    getMaxMarketBorrowForCauldronV2(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    getMaxMarketBorrowForCauldronV3(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    getMaxUserBorrowForCauldronV2(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    getMaxUserBorrowForCauldronV3(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    getMaximumCollateralRatio(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    getOracleExchangeRate(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    getTokenInBentoBox(
      bentoBox: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { share: BigNumber; amount: BigNumber }>;

    getTotalBorrowed(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;

    getTotalCollateral(
      cauldron: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[MarketLens.AmountValueStructOutput]>;

    getUserBorrow(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    getUserCollateral(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[MarketLens.AmountValueStructOutput]>;

    getUserLiquidationPrice(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { liquidationPrice: BigNumber }>;

    getUserLtv(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { ltvBps: BigNumber }>;

    getUserMaxBorrow(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    getUserPosition(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[MarketLens.UserPositionStructOutput]>;

    getUserPositions(
      cauldron: PromiseOrValue<string>,
      accounts: PromiseOrValue<string>[],
      overrides?: CallOverrides,
    ): Promise<
      [MarketLens.UserPositionStructOutput[]] & {
        positions: MarketLens.UserPositionStructOutput[];
      }
    >;
  };

  getBorrowFee(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  getCollateralPrice(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  getHealthFactor(
    cauldron: PromiseOrValue<string>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  getInterestPerYear(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  getLiquidationFee(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  getMarketInfoCauldronV2(
    cauldron: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<MarketLens.MarketInfoStructOutput>;

  getMarketInfoCauldronV3(
    cauldron: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<MarketLens.MarketInfoStructOutput>;

  getMaxMarketBorrowForCauldronV2(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  getMaxMarketBorrowForCauldronV3(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  getMaxUserBorrowForCauldronV2(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  getMaxUserBorrowForCauldronV3(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  getMaximumCollateralRatio(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  getOracleExchangeRate(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  getTokenInBentoBox(
    bentoBox: PromiseOrValue<string>,
    token: PromiseOrValue<string>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber] & { share: BigNumber; amount: BigNumber }>;

  getTotalBorrowed(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

  getTotalCollateral(
    cauldron: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<MarketLens.AmountValueStructOutput>;

  getUserBorrow(
    cauldron: PromiseOrValue<string>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  getUserCollateral(
    cauldron: PromiseOrValue<string>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<MarketLens.AmountValueStructOutput>;

  getUserLiquidationPrice(
    cauldron: PromiseOrValue<string>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  getUserLtv(
    cauldron: PromiseOrValue<string>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  getUserMaxBorrow(
    cauldron: PromiseOrValue<string>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  getUserPosition(
    cauldron: PromiseOrValue<string>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides,
  ): Promise<MarketLens.UserPositionStructOutput>;

  getUserPositions(
    cauldron: PromiseOrValue<string>,
    accounts: PromiseOrValue<string>[],
    overrides?: CallOverrides,
  ): Promise<MarketLens.UserPositionStructOutput[]>;

  callStatic: {
    getBorrowFee(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getCollateralPrice(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getHealthFactor(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getInterestPerYear(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getLiquidationFee(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getMarketInfoCauldronV2(
      cauldron: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<MarketLens.MarketInfoStructOutput>;

    getMarketInfoCauldronV3(
      cauldron: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<MarketLens.MarketInfoStructOutput>;

    getMaxMarketBorrowForCauldronV2(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getMaxMarketBorrowForCauldronV3(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getMaxUserBorrowForCauldronV2(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getMaxUserBorrowForCauldronV3(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getMaximumCollateralRatio(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getOracleExchangeRate(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getTokenInBentoBox(
      bentoBox: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { share: BigNumber; amount: BigNumber }>;

    getTotalBorrowed(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getTotalCollateral(
      cauldron: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<MarketLens.AmountValueStructOutput>;

    getUserBorrow(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getUserCollateral(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<MarketLens.AmountValueStructOutput>;

    getUserLiquidationPrice(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getUserLtv(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getUserMaxBorrow(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getUserPosition(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<MarketLens.UserPositionStructOutput>;

    getUserPositions(
      cauldron: PromiseOrValue<string>,
      accounts: PromiseOrValue<string>[],
      overrides?: CallOverrides,
    ): Promise<MarketLens.UserPositionStructOutput[]>;
  };

  filters: {};

  estimateGas: {
    getBorrowFee(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getCollateralPrice(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getHealthFactor(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getInterestPerYear(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getLiquidationFee(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getMarketInfoCauldronV2(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getMarketInfoCauldronV3(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getMaxMarketBorrowForCauldronV2(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getMaxMarketBorrowForCauldronV3(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getMaxUserBorrowForCauldronV2(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getMaxUserBorrowForCauldronV3(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getMaximumCollateralRatio(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getOracleExchangeRate(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getTokenInBentoBox(
      bentoBox: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getTotalBorrowed(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getTotalCollateral(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;

    getUserBorrow(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getUserCollateral(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getUserLiquidationPrice(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getUserLtv(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getUserMaxBorrow(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getUserPosition(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getUserPositions(
      cauldron: PromiseOrValue<string>,
      accounts: PromiseOrValue<string>[],
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getBorrowFee(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getCollateralPrice(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getHealthFactor(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getInterestPerYear(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getLiquidationFee(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getMarketInfoCauldronV2(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getMarketInfoCauldronV3(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getMaxMarketBorrowForCauldronV2(
      cauldron: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getMaxMarketBorrowForCauldronV3(
      cauldron: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getMaxUserBorrowForCauldronV2(
      cauldron: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getMaxUserBorrowForCauldronV3(
      cauldron: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getMaximumCollateralRatio(
      cauldron: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getOracleExchangeRate(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTokenInBentoBox(
      bentoBox: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getTotalBorrowed(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTotalCollateral(cauldron: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getUserBorrow(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getUserCollateral(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getUserLiquidationPrice(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getUserLtv(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getUserMaxBorrow(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getUserPosition(
      cauldron: PromiseOrValue<string>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getUserPositions(
      cauldron: PromiseOrValue<string>,
      accounts: PromiseOrValue<string>[],
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };
}
