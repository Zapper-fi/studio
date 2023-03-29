import { BigNumber, BigNumberish, ethers } from 'ethers';

import { DolomiteContractFactory, DolomiteMargin } from '~apps/dolomite/contracts';
import {
  DolomiteAmmFactory__factory,
  DolomiteAmmPair__factory,
  IsolationModeToken__factory,
} from '~apps/dolomite/contracts/ethers';
import { Erc20__factory, Multicall } from '~contract/contracts/ethers';
import { IMulticallWrapper } from '~multicall';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import {
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';
import { Network } from '~types';

import CallStruct = Multicall.CallStruct;

export interface AccountStruct {
  accountOwner: string;
  accountNumber: string;
}
export interface DolomiteContractPosition extends ContractPosition<DolomiteDataProps> {
  accountStructs: AccountStruct[];
}

export enum TokenMode {
  NORMAL = 'NORMAL',
  ISOLATION = 'ISOLATION',
  SILO = 'SILO',
}

export interface ExtraTokenInfo {
  unwrappedTokenAddress: string;
  wrappedTokenAddress: string;
  name: string;
  mode: TokenMode;
  marketId: number;
}

export interface DolomiteDataProps extends DefaultDataProps {
  extraTokenInfo: {
    [tokenAddress: string]: ExtraTokenInfo;
  };
}

export interface DolomiteTokenDefinition extends UnderlyingTokenDefinition {
  wrappedTokenAddress: string;
  mode: TokenMode;
  name: string;
}

export const CHUNK_SIZE = 32;

export const ISOLATION_MODE_MATCHERS = ['Dolomite Isolation:', 'Dolomite: Fee + Staked GLP'];

export const SILO_MODE_MATCHERS = ['Dolomite Silo:'];

export const SPECIAL_TOKEN_NAME_MATCHERS = [...ISOLATION_MODE_MATCHERS, ...SILO_MODE_MATCHERS];

export const DOLOMITE_MARGIN_ADDRESSES = {
  [Network.ARBITRUM_MAINNET]: '0x6bd780e7fdf01d77e4d475c821f1e7ae05409072',
};

export const DOLOMITE_AMM_FACTORY_ADDRESSES = {
  [Network.ARBITRUM_MAINNET]: '0xd99c21c96103f36bc1fa26dd6448af4da030c1ef',
};

export const DOLOMITE_GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/dolomite-exchange/dolomite-v2-arbitrum';

const ONE_DOLLAR = BigNumber.from('1000000000000000000000000000000000000');

const ONE_INDEX = BigNumber.from('1000000000000000000');

export function chunkArrayForMultiCall<T>(
  values: T[],
  getCallData: (value: T, index: number) => { target: string; callData: string },
): Multicall.CallStruct[][] {
  const callChunks: Multicall.CallStruct[][] = [];
  let index = 0;
  for (let i = 0; i < values.length; i += CHUNK_SIZE) {
    callChunks[i] = [];
    for (let j = 0; j < CHUNK_SIZE && index < values.length; j++) {
      callChunks[i / CHUNK_SIZE].push(getCallData(values[i + j], i + j));
      index += 1;
    }
  }
  return callChunks;
}

export async function getTokenDefinitionsLib(
  params: GetTokenDefinitionsParams<DolomiteMargin>,
  dolomiteContractFactory: DolomiteContractFactory,
  network: Network,
): Promise<DolomiteTokenDefinition[]> {
  const tokenCount = (await params.contract.getNumMarkets()).toNumber();

  const tokenAddressCallChunks = chunkArrayForMultiCall(
    Array.from({ length: tokenCount }, (_, i) => i),
    (_, i) => ({
      target: params.address,
      callData: params.contract.interface.encodeFunctionData('getMarketTokenAddress', [i]),
    }),
  );
  let tokenAddresses: string[] = [];
  for (let i = 0; i < tokenAddressCallChunks.length; i++) {
    const { returnData } = await params.multicall.contract.callStatic.aggregate(tokenAddressCallChunks[i], false);
    const rawTokens = returnData.map(({ data }): string => {
      return (ethers.utils.defaultAbiCoder.decode(['address'], data)[0] as string).toLowerCase();
    });
    tokenAddresses = tokenAddresses.concat(...rawTokens);
  }

  const tokenNameCallChunks = chunkArrayForMultiCall(tokenAddresses, tokenAddress => ({
    target: tokenAddress,
    callData: Erc20__factory.createInterface().encodeFunctionData('name'),
  }));
  let tokenNames: string[] = [];
  for (let i = 0; i < tokenNameCallChunks.length; i++) {
    const { returnData } = await params.multicall.contract.callStatic.aggregate(tokenNameCallChunks[i], false);
    const rawTokens = returnData.map(({ data }): string => {
      return ethers.utils.defaultAbiCoder.decode(['string'], data)[0] as string;
    });
    tokenNames = tokenNames.concat(...rawTokens);
  }

  const wrappedTokenAddresses: string[] = [];
  const modes: TokenMode[] = [];
  for (let i = 0; i < tokenAddresses.length; i++) {
    wrappedTokenAddresses.push(tokenAddresses[i]);
    const tokenName = tokenNames[i];
    if (SPECIAL_TOKEN_NAME_MATCHERS.some(matcher => tokenName.includes(matcher))) {
      modes[i] = ISOLATION_MODE_MATCHERS.find(matcher => tokenName.includes(matcher))
        ? TokenMode.ISOLATION
        : SILO_MODE_MATCHERS.find(matcher => tokenName.includes(matcher))
        ? TokenMode.SILO
        : TokenMode.NORMAL;
      const isolationModeTokenContract = dolomiteContractFactory.isolationModeToken({
        address: tokenAddresses[i],
        network: network,
      });
      if (tokenName.includes('Fee + Staked GLP')) {
        // special edge-case for fee + staked GLP token.
        tokenAddresses[i] = '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258';
      } else {
        tokenAddresses[i] = (await isolationModeTokenContract.UNDERLYING_TOKEN()).toLowerCase();
      }
    } else {
      modes.push(TokenMode.NORMAL);
    }
  }

  const tokens: DolomiteTokenDefinition[] = [];
  for (let i = 0; i < tokenAddresses.length; i++) {
    tokens.push({
      address: tokenAddresses[i],
      network: network,
      metaType: MetaType.SUPPLIED,
      name: tokenNames[i],
      mode: modes[i],
      wrappedTokenAddress: wrappedTokenAddresses[i],
    });
  }

  return tokens;
}

export async function mapTokensToDolomiteDataProps(
  params: GetDataPropsParams<DolomiteMargin, DolomiteDataProps>,
  tokenDefinitions: DolomiteTokenDefinition[],
  isFetchingDolomiteBalances: boolean,
  network: Network,
  multicall: IMulticallWrapper,
): Promise<DolomiteDataProps> {
  let liquidity: number | undefined = undefined;
  if (isFetchingDolomiteBalances) {
    // only get TVL for DolomiteBalances to prevent double counting
    liquidity = 0;
    for (let i = 0; i < tokenDefinitions.length; i++) {
      const contract = multicall.wrap(params.contract);
      const totalPar = await contract.getMarketTotalPar(i);
      const index = await contract.getMarketCurrentIndex(i);
      const totalSupply = totalPar.supply.mul(index.supply).div(ONE_INDEX);
      const totalBorrow = totalPar.borrow.mul(index.borrow).div(ONE_INDEX);
      const price = (await contract.getMarketPrice(i)).value;
      liquidity += totalSupply.sub(totalBorrow).mul(price).div(ONE_DOLLAR.div(100000)).toNumber() / 100000.0;
    }
  }

  return {
    liquidity,
    extraTokenInfo: tokenDefinitions.reduce<Record<string, ExtraTokenInfo>>((memo, token, i) => {
      memo[token.wrappedTokenAddress] = {
        wrappedTokenAddress: token.wrappedTokenAddress,
        unwrappedTokenAddress: token.address.toLowerCase(),
        name: token.name,
        mode: token.mode,
        marketId: i,
      };
      memo[token.address.toLowerCase()] = {
        wrappedTokenAddress: token.wrappedTokenAddress,
        unwrappedTokenAddress: token.address.toLowerCase(),
        name: token.name,
        mode: token.mode,
        marketId: i,
      };
      return memo;
    }, {}),
  };
}

export async function getTokenBalancesPerAccountStructLib(
  params: GetTokenBalancesParams<DolomiteMargin, DolomiteDataProps>,
  accountStruct: AccountStruct,
): Promise<Map<string, BigNumberish>> {
  const tokenAddressToAmount = new Map<string, BigNumberish>();
  const [, tokenAddresses, , weiAmounts] = await params.contract.getAccountBalances({
    owner: accountStruct.accountOwner,
    number: accountStruct.accountNumber,
  });
  tokenAddresses.forEach((tokenAddress, i) => {
    let amount = BigNumber.from(weiAmounts[i].value);
    if (!weiAmounts[i].sign) {
      amount = amount.mul(-1);
    }
    tokenAddress = params.contractPosition.dataProps.extraTokenInfo[tokenAddress.toLowerCase()].unwrappedTokenAddress;
    tokenAddressToAmount.set(tokenAddress, amount);
  });

  return tokenAddressToAmount;
}

export async function getVaultAddresses(
  account: string,
  isolationModeTokenAddresses: string[],
  multicall: Multicall,
): Promise<string[]> {
  const calls: CallStruct[] = isolationModeTokenAddresses.map(tokenAddress => {
    return {
      target: tokenAddress,
      callData: IsolationModeToken__factory.createInterface().encodeFunctionData('getVaultByAccount', [account]),
    };
  });
  const results = await multicall.callStatic.aggregate(calls, true);
  return results.returnData.map(({ data }) => {
    return ethers.utils.defaultAbiCoder.decode(['address'], data)[0].toLowerCase();
  });
}

export async function getAllIsolationModeTokensFromContractPositions(
  account: string,
  contractPositions: ContractPosition<DolomiteDataProps>[],
  multicall: IMulticallWrapper,
): Promise<string[]> {
  const isolationModeTokensMap = contractPositions.reduce<Record<string, string>>((memo, position) => {
    position.tokens.forEach(token => {
      const extraData = position.dataProps.extraTokenInfo[token.address];
      if (!memo[token.address] && extraData.mode === TokenMode.ISOLATION) {
        memo[token.address] = extraData.wrappedTokenAddress;
      }
    });
    return memo;
  }, {});
  const isolationModeTokens = Object.values(isolationModeTokensMap);
  return getVaultAddresses(account, isolationModeTokens, multicall.contract);
}
