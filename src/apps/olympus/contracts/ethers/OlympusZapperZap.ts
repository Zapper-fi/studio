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
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common';

export interface OlympusZapperZapInterface extends utils.Interface {
  functions: {
    'OHM()': FunctionFragment;
    'ZapIn(address,uint256,address,uint256,address,bytes,address,address,uint256,bool)': FunctionFragment;
    'ZapOut(address,uint256,address,uint256,address,bytes,address)': FunctionFragment;
    'affiliateBalance(address,address)': FunctionFragment;
    'affiliates(address)': FunctionFragment;
    'affilliateWithdraw(address[])': FunctionFragment;
    'approvedTargets(address)': FunctionFragment;
    'bondPrice(address,address)': FunctionFragment;
    'feeWhitelist(address)': FunctionFragment;
    'goodwill()': FunctionFragment;
    'olympusDAO()': FunctionFragment;
    'owner()': FunctionFragment;
    'principalToDepository(address,address)': FunctionFragment;
    'removeLiquidityReturn(address,uint256)': FunctionFragment;
    'renounceOwnership()': FunctionFragment;
    'sOHM()': FunctionFragment;
    'setApprovedTargets(address[],bool[])': FunctionFragment;
    'set_affiliate(address,bool)': FunctionFragment;
    'set_feeWhitelist(address,bool)': FunctionFragment;
    'set_new_affiliateSplit(uint256)': FunctionFragment;
    'set_new_goodwill(uint256)': FunctionFragment;
    'staking()': FunctionFragment;
    'stopped()': FunctionFragment;
    'toggleContractActive()': FunctionFragment;
    'totalAffiliateBalance(address)': FunctionFragment;
    'transferOwnership(address)': FunctionFragment;
    'update_BondDepos(address[],address[],address[])': FunctionFragment;
    'update_OlympusDAO(address)': FunctionFragment;
    'update_Staking(address)': FunctionFragment;
    'update_sOHM(address)': FunctionFragment;
    'update_wsOHM(address)': FunctionFragment;
    'withdrawTokens(address[])': FunctionFragment;
    'wsOHM()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'OHM'
      | 'ZapIn'
      | 'ZapOut'
      | 'affiliateBalance'
      | 'affiliates'
      | 'affilliateWithdraw'
      | 'approvedTargets'
      | 'bondPrice'
      | 'feeWhitelist'
      | 'goodwill'
      | 'olympusDAO'
      | 'owner'
      | 'principalToDepository'
      | 'removeLiquidityReturn'
      | 'renounceOwnership'
      | 'sOHM'
      | 'setApprovedTargets'
      | 'set_affiliate'
      | 'set_feeWhitelist'
      | 'set_new_affiliateSplit'
      | 'set_new_goodwill'
      | 'staking'
      | 'stopped'
      | 'toggleContractActive'
      | 'totalAffiliateBalance'
      | 'transferOwnership'
      | 'update_BondDepos'
      | 'update_OlympusDAO'
      | 'update_Staking'
      | 'update_sOHM'
      | 'update_wsOHM'
      | 'withdrawTokens'
      | 'wsOHM',
  ): FunctionFragment;

  encodeFunctionData(functionFragment: 'OHM', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'ZapIn',
    values: [string, BigNumberish, string, BigNumberish, string, BytesLike, string, string, BigNumberish, boolean],
  ): string;
  encodeFunctionData(
    functionFragment: 'ZapOut',
    values: [string, BigNumberish, string, BigNumberish, string, BytesLike, string],
  ): string;
  encodeFunctionData(functionFragment: 'affiliateBalance', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'affiliates', values: [string]): string;
  encodeFunctionData(functionFragment: 'affilliateWithdraw', values: [string[]]): string;
  encodeFunctionData(functionFragment: 'approvedTargets', values: [string]): string;
  encodeFunctionData(functionFragment: 'bondPrice', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'feeWhitelist', values: [string]): string;
  encodeFunctionData(functionFragment: 'goodwill', values?: undefined): string;
  encodeFunctionData(functionFragment: 'olympusDAO', values?: undefined): string;
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
  encodeFunctionData(functionFragment: 'principalToDepository', values: [string, string]): string;
  encodeFunctionData(functionFragment: 'removeLiquidityReturn', values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
  encodeFunctionData(functionFragment: 'sOHM', values?: undefined): string;
  encodeFunctionData(functionFragment: 'setApprovedTargets', values: [string[], boolean[]]): string;
  encodeFunctionData(functionFragment: 'set_affiliate', values: [string, boolean]): string;
  encodeFunctionData(functionFragment: 'set_feeWhitelist', values: [string, boolean]): string;
  encodeFunctionData(functionFragment: 'set_new_affiliateSplit', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'set_new_goodwill', values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: 'staking', values?: undefined): string;
  encodeFunctionData(functionFragment: 'stopped', values?: undefined): string;
  encodeFunctionData(functionFragment: 'toggleContractActive', values?: undefined): string;
  encodeFunctionData(functionFragment: 'totalAffiliateBalance', values: [string]): string;
  encodeFunctionData(functionFragment: 'transferOwnership', values: [string]): string;
  encodeFunctionData(functionFragment: 'update_BondDepos', values: [string[], string[], string[]]): string;
  encodeFunctionData(functionFragment: 'update_OlympusDAO', values: [string]): string;
  encodeFunctionData(functionFragment: 'update_Staking', values: [string]): string;
  encodeFunctionData(functionFragment: 'update_sOHM', values: [string]): string;
  encodeFunctionData(functionFragment: 'update_wsOHM', values: [string]): string;
  encodeFunctionData(functionFragment: 'withdrawTokens', values: [string[]]): string;
  encodeFunctionData(functionFragment: 'wsOHM', values?: undefined): string;

  decodeFunctionResult(functionFragment: 'OHM', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'ZapIn', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'ZapOut', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'affiliateBalance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'affiliates', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'affilliateWithdraw', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'approvedTargets', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'bondPrice', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'feeWhitelist', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'goodwill', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'olympusDAO', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'principalToDepository', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'removeLiquidityReturn', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'sOHM', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setApprovedTargets', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'set_affiliate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'set_feeWhitelist', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'set_new_affiliateSplit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'set_new_goodwill', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'staking', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'stopped', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'toggleContractActive', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'totalAffiliateBalance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'update_BondDepos', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'update_OlympusDAO', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'update_Staking', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'update_sOHM', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'update_wsOHM', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'withdrawTokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'wsOHM', data: BytesLike): Result;

  events: {
    'OwnershipTransferred(address,address)': EventFragment;
    'zapIn(address,address,uint256,address)': EventFragment;
    'zapOut(address,address,uint256,address)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'zapIn'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'zapOut'): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[string, string], OwnershipTransferredEventObject>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface zapInEventObject {
  sender: string;
  token: string;
  tokensRec: BigNumber;
  affiliate: string;
}
export type zapInEvent = TypedEvent<[string, string, BigNumber, string], zapInEventObject>;

export type zapInEventFilter = TypedEventFilter<zapInEvent>;

export interface zapOutEventObject {
  sender: string;
  token: string;
  tokensRec: BigNumber;
  affiliate: string;
}
export type zapOutEvent = TypedEvent<[string, string, BigNumber, string], zapOutEventObject>;

export type zapOutEventFilter = TypedEventFilter<zapOutEvent>;

export interface OlympusZapperZap extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OlympusZapperZapInterface;

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
    OHM(overrides?: CallOverrides): Promise<[string]>;

    ZapIn(
      fromToken: string,
      amountIn: BigNumberish,
      toToken: string,
      minToToken: BigNumberish,
      swapTarget: string,
      swapData: BytesLike,
      affiliate: string,
      bondPayoutToken: string,
      maxBondPrice: BigNumberish,
      bond: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    ZapOut(
      fromToken: string,
      amountIn: BigNumberish,
      toToken: string,
      minToTokens: BigNumberish,
      swapTarget: string,
      swapData: BytesLike,
      affiliate: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    affiliateBalance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    affiliates(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    affilliateWithdraw(
      tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    approvedTargets(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    bondPrice(principal: string, payoutToken: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    feeWhitelist(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    goodwill(overrides?: CallOverrides): Promise<[BigNumber]>;

    olympusDAO(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    principalToDepository(arg0: string, arg1: string, overrides?: CallOverrides): Promise<[string]>;

    removeLiquidityReturn(
      fromToken: string,
      fromAmount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { ohmAmount: BigNumber }>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    sOHM(overrides?: CallOverrides): Promise<[string]>;

    setApprovedTargets(
      targets: string[],
      isApproved: boolean[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    set_affiliate(
      _affiliate: string,
      _status: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    set_feeWhitelist(
      zapAddress: string,
      status: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    set_new_affiliateSplit(
      _new_affiliateSplit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    set_new_goodwill(
      _new_goodwill: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    staking(overrides?: CallOverrides): Promise<[string]>;

    stopped(overrides?: CallOverrides): Promise<[boolean]>;

    toggleContractActive(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

    totalAffiliateBalance(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    update_BondDepos(
      principals: string[],
      payoutTokens: string[],
      depos: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    update_OlympusDAO(
      _olympusDAO: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    update_Staking(
      _staking: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    update_sOHM(
      _sOHM: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    update_wsOHM(
      _wsOHM: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    withdrawTokens(
      tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    wsOHM(overrides?: CallOverrides): Promise<[string]>;
  };

  OHM(overrides?: CallOverrides): Promise<string>;

  ZapIn(
    fromToken: string,
    amountIn: BigNumberish,
    toToken: string,
    minToToken: BigNumberish,
    swapTarget: string,
    swapData: BytesLike,
    affiliate: string,
    bondPayoutToken: string,
    maxBondPrice: BigNumberish,
    bond: boolean,
    overrides?: PayableOverrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  ZapOut(
    fromToken: string,
    amountIn: BigNumberish,
    toToken: string,
    minToTokens: BigNumberish,
    swapTarget: string,
    swapData: BytesLike,
    affiliate: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  affiliateBalance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

  affiliates(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  affilliateWithdraw(
    tokens: string[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  approvedTargets(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  bondPrice(principal: string, payoutToken: string, overrides?: CallOverrides): Promise<BigNumber>;

  feeWhitelist(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  goodwill(overrides?: CallOverrides): Promise<BigNumber>;

  olympusDAO(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  principalToDepository(arg0: string, arg1: string, overrides?: CallOverrides): Promise<string>;

  removeLiquidityReturn(fromToken: string, fromAmount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  sOHM(overrides?: CallOverrides): Promise<string>;

  setApprovedTargets(
    targets: string[],
    isApproved: boolean[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  set_affiliate(
    _affiliate: string,
    _status: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  set_feeWhitelist(
    zapAddress: string,
    status: boolean,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  set_new_affiliateSplit(
    _new_affiliateSplit: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  set_new_goodwill(
    _new_goodwill: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  staking(overrides?: CallOverrides): Promise<string>;

  stopped(overrides?: CallOverrides): Promise<boolean>;

  toggleContractActive(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  totalAffiliateBalance(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  update_BondDepos(
    principals: string[],
    payoutTokens: string[],
    depos: string[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  update_OlympusDAO(
    _olympusDAO: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  update_Staking(
    _staking: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  update_sOHM(_sOHM: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>;

  update_wsOHM(
    _wsOHM: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  withdrawTokens(
    tokens: string[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  wsOHM(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    OHM(overrides?: CallOverrides): Promise<string>;

    ZapIn(
      fromToken: string,
      amountIn: BigNumberish,
      toToken: string,
      minToToken: BigNumberish,
      swapTarget: string,
      swapData: BytesLike,
      affiliate: string,
      bondPayoutToken: string,
      maxBondPrice: BigNumberish,
      bond: boolean,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    ZapOut(
      fromToken: string,
      amountIn: BigNumberish,
      toToken: string,
      minToTokens: BigNumberish,
      swapTarget: string,
      swapData: BytesLike,
      affiliate: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    affiliateBalance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    affiliates(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    affilliateWithdraw(tokens: string[], overrides?: CallOverrides): Promise<void>;

    approvedTargets(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    bondPrice(principal: string, payoutToken: string, overrides?: CallOverrides): Promise<BigNumber>;

    feeWhitelist(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    goodwill(overrides?: CallOverrides): Promise<BigNumber>;

    olympusDAO(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    principalToDepository(arg0: string, arg1: string, overrides?: CallOverrides): Promise<string>;

    removeLiquidityReturn(fromToken: string, fromAmount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    sOHM(overrides?: CallOverrides): Promise<string>;

    setApprovedTargets(targets: string[], isApproved: boolean[], overrides?: CallOverrides): Promise<void>;

    set_affiliate(_affiliate: string, _status: boolean, overrides?: CallOverrides): Promise<void>;

    set_feeWhitelist(zapAddress: string, status: boolean, overrides?: CallOverrides): Promise<void>;

    set_new_affiliateSplit(_new_affiliateSplit: BigNumberish, overrides?: CallOverrides): Promise<void>;

    set_new_goodwill(_new_goodwill: BigNumberish, overrides?: CallOverrides): Promise<void>;

    staking(overrides?: CallOverrides): Promise<string>;

    stopped(overrides?: CallOverrides): Promise<boolean>;

    toggleContractActive(overrides?: CallOverrides): Promise<void>;

    totalAffiliateBalance(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(newOwner: string, overrides?: CallOverrides): Promise<void>;

    update_BondDepos(
      principals: string[],
      payoutTokens: string[],
      depos: string[],
      overrides?: CallOverrides,
    ): Promise<void>;

    update_OlympusDAO(_olympusDAO: string, overrides?: CallOverrides): Promise<void>;

    update_Staking(_staking: string, overrides?: CallOverrides): Promise<void>;

    update_sOHM(_sOHM: string, overrides?: CallOverrides): Promise<void>;

    update_wsOHM(_wsOHM: string, overrides?: CallOverrides): Promise<void>;

    withdrawTokens(tokens: string[], overrides?: CallOverrides): Promise<void>;

    wsOHM(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    'OwnershipTransferred(address,address)'(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(previousOwner?: string | null, newOwner?: string | null): OwnershipTransferredEventFilter;

    'zapIn(address,address,uint256,address)'(
      sender?: null,
      token?: null,
      tokensRec?: null,
      affiliate?: null,
    ): zapInEventFilter;
    zapIn(sender?: null, token?: null, tokensRec?: null, affiliate?: null): zapInEventFilter;

    'zapOut(address,address,uint256,address)'(
      sender?: null,
      token?: null,
      tokensRec?: null,
      affiliate?: null,
    ): zapOutEventFilter;
    zapOut(sender?: null, token?: null, tokensRec?: null, affiliate?: null): zapOutEventFilter;
  };

  estimateGas: {
    OHM(overrides?: CallOverrides): Promise<BigNumber>;

    ZapIn(
      fromToken: string,
      amountIn: BigNumberish,
      toToken: string,
      minToToken: BigNumberish,
      swapTarget: string,
      swapData: BytesLike,
      affiliate: string,
      bondPayoutToken: string,
      maxBondPrice: BigNumberish,
      bond: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    ZapOut(
      fromToken: string,
      amountIn: BigNumberish,
      toToken: string,
      minToTokens: BigNumberish,
      swapTarget: string,
      swapData: BytesLike,
      affiliate: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    affiliateBalance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    affiliates(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    affilliateWithdraw(
      tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    approvedTargets(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    bondPrice(principal: string, payoutToken: string, overrides?: CallOverrides): Promise<BigNumber>;

    feeWhitelist(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    goodwill(overrides?: CallOverrides): Promise<BigNumber>;

    olympusDAO(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    principalToDepository(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

    removeLiquidityReturn(fromToken: string, fromAmount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    sOHM(overrides?: CallOverrides): Promise<BigNumber>;

    setApprovedTargets(
      targets: string[],
      isApproved: boolean[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    set_affiliate(
      _affiliate: string,
      _status: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    set_feeWhitelist(
      zapAddress: string,
      status: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    set_new_affiliateSplit(
      _new_affiliateSplit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    set_new_goodwill(
      _new_goodwill: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    staking(overrides?: CallOverrides): Promise<BigNumber>;

    stopped(overrides?: CallOverrides): Promise<BigNumber>;

    toggleContractActive(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    totalAffiliateBalance(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    update_BondDepos(
      principals: string[],
      payoutTokens: string[],
      depos: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    update_OlympusDAO(
      _olympusDAO: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    update_Staking(_staking: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    update_sOHM(_sOHM: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    update_wsOHM(_wsOHM: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    withdrawTokens(tokens: string[], overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    wsOHM(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    OHM(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ZapIn(
      fromToken: string,
      amountIn: BigNumberish,
      toToken: string,
      minToToken: BigNumberish,
      swapTarget: string,
      swapData: BytesLike,
      affiliate: string,
      bondPayoutToken: string,
      maxBondPrice: BigNumberish,
      bond: boolean,
      overrides?: PayableOverrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    ZapOut(
      fromToken: string,
      amountIn: BigNumberish,
      toToken: string,
      minToTokens: BigNumberish,
      swapTarget: string,
      swapData: BytesLike,
      affiliate: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    affiliateBalance(arg0: string, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    affiliates(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    affilliateWithdraw(
      tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    approvedTargets(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bondPrice(principal: string, payoutToken: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    feeWhitelist(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    goodwill(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    olympusDAO(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    principalToDepository(arg0: string, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeLiquidityReturn(
      fromToken: string,
      fromAmount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    sOHM(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setApprovedTargets(
      targets: string[],
      isApproved: boolean[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    set_affiliate(
      _affiliate: string,
      _status: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    set_feeWhitelist(
      zapAddress: string,
      status: boolean,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    set_new_affiliateSplit(
      _new_affiliateSplit: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    set_new_goodwill(
      _new_goodwill: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    staking(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    stopped(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    toggleContractActive(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>;

    totalAffiliateBalance(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    update_BondDepos(
      principals: string[],
      payoutTokens: string[],
      depos: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    update_OlympusDAO(
      _olympusDAO: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    update_Staking(
      _staking: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    update_sOHM(
      _sOHM: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    update_wsOHM(
      _wsOHM: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    withdrawTokens(
      tokens: string[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    wsOHM(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
