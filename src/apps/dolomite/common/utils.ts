import { BigNumber, BigNumberish, ethers } from 'ethers';

import { DolomiteMargin } from '~apps/dolomite/contracts';
import { IsolationModeToken__factory } from '~apps/dolomite/contracts/ethers';
import { Multicall } from '~contract/contracts/ethers';
import { IMulticallWrapper } from '~multicall';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';
import { Network } from '~types';

export interface AccountStruct {
  accountOwner: string;
  accountNumber: string;
}
export interface DolomiteContractPosition extends ContractPosition<DolomiteDataProps> {
  accountStructs: AccountStruct[];
}

export interface DolomiteContractPositionDefinition extends DefaultContractPositionDefinition {
  marketsCount: number;
  marketIdToMarketMap: {
    [marketId: number]: ExtraTokenInfo;
  };
}

export enum TokenMode {
  NORMAL = 'NORMAL',
  ISOLATION = 'ISOLATION',
  SILO = 'SILO',
}

export interface ExtraTokenInfo {
  underlyingTokenAddress: string;
  wrappedTokenAddress: string;
  name: string;
  mode: TokenMode;
  marketId: number;
}

export interface DolomiteDataProps extends DefaultDataProps {
  liquidity: number | undefined;
  marketsCount: number;
  marketIdToMarketMap: {
    [marketId: number]: ExtraTokenInfo;
  };
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

export async function getTokenDefinitionsLib(
  params: GetTokenDefinitionsParams<DolomiteMargin, DolomiteContractPositionDefinition>,
  network: Network,
): Promise<UnderlyingTokenDefinition[]> {
  const tokens: UnderlyingTokenDefinition[] = [];
  for (let i = 0; i < params.definition.marketsCount; i++) {
    tokens.push({
      address: params.definition.marketIdToMarketMap[i].underlyingTokenAddress,
      network: network,
      metaType: MetaType.SUPPLIED,
    });
  }
  return tokens;
}

export async function mapTokensToDolomiteDataProps(
  params: GetDataPropsParams<DolomiteMargin, DolomiteDataProps, DolomiteContractPositionDefinition>,
  isFetchingDolomiteBalances: boolean,
  multicall: IMulticallWrapper,
): Promise<DolomiteDataProps> {
  let liquidity: number | undefined = undefined;
  if (isFetchingDolomiteBalances) {
    // only get TVL for DolomiteBalances to prevent double counting and making unnecessary network calls
    liquidity = 0;
    for (let i = 0; i < params.definition.marketsCount; i++) {
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
    marketsCount: params.definition.marketsCount,
    marketIdToMarketMap: params.definition.marketIdToMarketMap,
  };
}

export async function getTokenBalancesPerAccountStructLib(
  params: GetTokenBalancesParams<DolomiteMargin, DolomiteDataProps>,
  accountStruct: AccountStruct,
): Promise<Map<string, BigNumberish>> {
  const tokenAddressToAmount = new Map<string, BigNumberish>();
  const [marketIds, tokenAddresses, , weiAmounts] = await params.contract.getAccountBalances({
    owner: accountStruct.accountOwner,
    number: accountStruct.accountNumber,
  });
  tokenAddresses.forEach((tokenAddress, i) => {
    let amount = BigNumber.from(weiAmounts[i].value);
    if (!weiAmounts[i].sign) {
      amount = amount.mul(-1);
    }
    const marketId = marketIds[i].toNumber();
    tokenAddress = params.contractPosition.dataProps.marketIdToMarketMap[marketId].underlyingTokenAddress;
    tokenAddressToAmount.set(tokenAddress, amount);
  });

  return tokenAddressToAmount;
}

export async function getVaultAddresses(
  account: string,
  isolationModeTokenAddresses: string[],
  multicall: Multicall,
): Promise<string[]> {
  const calls: Multicall.CallStruct[] = isolationModeTokenAddresses.map(tokenAddress => {
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
    position.tokens.forEach((token, i) => {
      const extraData = position.dataProps.marketIdToMarketMap[i];
      if (!memo[token.address] && extraData.mode === TokenMode.ISOLATION) {
        memo[token.address] = extraData.wrappedTokenAddress;
      }
    });
    return memo;
  }, {});
  const isolationModeTokens = Object.values(isolationModeTokensMap);
  return getVaultAddresses(account, isolationModeTokens, multicall.contract);
}
