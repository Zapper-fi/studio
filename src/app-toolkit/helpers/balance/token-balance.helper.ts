import { Inject, Injectable } from '@nestjs/common';
import BigNumberJS from 'bignumber.js';
import { identity, isArray, pick } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps, StatsItem, WithMetaType } from '~position/display.interface';
import { AppTokenPositionBalance, BaseTokenBalance } from '~position/position-balance.interface';
import { AppTokenPosition, ContractPosition, MetaType, Token } from '~position/position.interface';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { buildPercentageDisplayItem } from '../presentation/display-item.present';

type GetTokenBalancesParams<T> = {
  network: Network;
  appId: string;
  groupId: string;
  address: string;
  filter?: (contractPosition: AppTokenPosition<T>) => boolean;
  resolveBalance?: (opts: {
    multicall: IMulticallWrapper;
    address: string;
    token: AppTokenPosition<T>;
  }) => Promise<string>;
};

type Options = {
  isDebt?: boolean;
};

type InferHasMetaType<T, B> = T extends WithMetaType<T> ? WithMetaType<B> : B;

type InferTokenBalanceType<T> = T extends AppTokenPosition
  ? InferHasMetaType<T, AppTokenPositionBalance>
  : T extends BaseToken
  ? InferHasMetaType<T, BaseTokenBalance>
  : never;

export const getContractPositionFromToken = <T>(
  token: AppTokenPosition<T>,
  overrides?: Partial<ContractPosition<T>>,
): ContractPosition<T> => {
  const type = ContractType.POSITION;
  const partial = pick(token, 'address', 'network', 'appId', 'groupId');
  const dataProps = { ...token.dataProps, ...overrides?.dataProps };
  const displayProps = { ...token.displayProps, ...overrides?.displayProps };
  const tokens = overrides?.tokens ?? token.tokens.map(v => ({ metaType: MetaType.SUPPLIED, ...v }));
  const contractPosition: ContractPosition<T> = { type, ...partial, ...overrides, tokens, dataProps, displayProps };
  return contractPosition;
};

export const drillBalance = <T extends Token>(
  token: T,
  balanceRaw: string,
  options: Options = {},
): InferTokenBalanceType<T> => {
  const balance = Number(balanceRaw) / 10 ** token.decimals;
  const balanceUSD = balance * token.price * (options.isDebt ? -1 : 1);

  if (token.type === ContractType.BASE_TOKEN || token.type === ContractType.NON_FUNGIBLE_TOKEN) {
    const tokenWithBalance = { ...(token as BaseToken), balance, balanceRaw, balanceUSD };
    return tokenWithBalance as unknown as InferTokenBalanceType<T>;
  }

  // Token share stats item
  const userStatsItems: StatsItem[] = [];
  if (token.supply > 0) {
    const share = (balance / token.supply) * 100;
    userStatsItems.push({ label: 'Share', value: buildPercentageDisplayItem(share) });
  }

  const tokenStatsItems = token.displayProps?.statsItems || [];
  const tokens = token.tokens || [];

  const tokenWithBalance = {
    ...token,
    balance,
    balanceRaw,
    balanceUSD,
    tokens: tokens.map((underlyingToken, i) => {
      const pricePerShare = isArray(token.pricePerShare) ? token.pricePerShare[i] : token.pricePerShare;
      const underlyingBalanceRawBN = new BigNumberJS(balanceRaw)
        .div(10 ** token.decimals)
        .times(10 ** underlyingToken.decimals)
        .times(pricePerShare);
      const underlyingBalanceRaw =
        underlyingToken.decimals === 0 ? underlyingBalanceRawBN.toFixed(18) : underlyingBalanceRawBN.toFixed(0);

      return drillBalance(underlyingToken, underlyingBalanceRaw);
    }),
    dataProps: token.dataProps,
    displayProps: {
      ...token.displayProps,
      statsItems: [...tokenStatsItems, ...userStatsItems],
    },
  };

  return tokenWithBalance as unknown as InferTokenBalanceType<T>;
};

@Injectable()
export class TokenBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTokenBalances<T = DefaultDataProps>({
    network,
    appId,
    groupId,
    address,
    filter = identity,
    resolveBalance = async ({ multicall, address, token }) => {
      return await multicall
        .wrap(this.appToolkit.globalContracts.erc20({ network, address: token.address }))
        .balanceOf(address)
        .then(v => v.toString());
    },
  }: GetTokenBalancesParams<T>) {
    const multicall = this.appToolkit.getMulticall(network);
    const appTokens = await this.appToolkit.getAppTokenPositions<T>({ appId, network, groupIds: [groupId] });

    const filteredTokens = appTokens.filter(filter);
    const balances = await Promise.all(
      filteredTokens.map(async token => {
        const balanceRaw = await resolveBalance({ multicall, address, token });
        const tokenBalance = drillBalance(token as AppTokenPosition, balanceRaw);
        return tokenBalance;
      }),
    );

    return balances.filter(v => v.balance > 0);
  }
}
