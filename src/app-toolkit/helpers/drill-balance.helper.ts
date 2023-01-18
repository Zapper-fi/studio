import BigNumberJS from 'bignumber.js';
import { isArray } from 'lodash';

import { ContractType } from '~position/contract.interface';
import { DefaultDataProps, StatsItem, WithMetaType } from '~position/display.interface';
import { AppTokenPositionBalance, BaseTokenBalance } from '~position/position-balance.interface';
import { AppTokenPosition, Token } from '~position/position.interface';
import { BaseToken } from '~position/token.interface';

import { buildPercentageDisplayItem } from './presentation/display-item.present';

type Options = {
  isDebt?: boolean;
};

type InferHasMetaType<T, B> = T extends WithMetaType<T> ? WithMetaType<B> : B;

type InferTokenBalanceType<T, V = DefaultDataProps> = T extends AppTokenPosition
  ? InferHasMetaType<T, AppTokenPositionBalance<V>>
  : T extends BaseToken
  ? InferHasMetaType<T, BaseTokenBalance>
  : never;

export const drillBalance = <T extends Token, V = DefaultDataProps>(
  token: T,
  balanceRaw: string,
  options: Options = {},
): InferTokenBalanceType<T, V> => {
  const balance = Number(balanceRaw) / 10 ** token.decimals;
  const balanceUSD = balance * token.price * (options.isDebt ? -1 : 1);

  if (token.type === ContractType.BASE_TOKEN || token.type === ContractType.NON_FUNGIBLE_TOKEN) {
    const tokenWithBalance = { ...(token as BaseToken), balance, balanceRaw, balanceUSD };
    return tokenWithBalance as unknown as InferTokenBalanceType<T, V>;
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

  return tokenWithBalance as unknown as InferTokenBalanceType<T, V>;
};
