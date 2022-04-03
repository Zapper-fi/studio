import { Inject, Injectable } from '@nestjs/common';
import BigNumberJS from 'bignumber.js';
import { isArray, pick } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { EthersMulticall } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { StatsItem, WithMetaType } from '~position/display.interface';
import { AppTokenPositionBalance, BaseTokenBalance } from '~position/position-balance.interface';
import { AppTokenPosition, ContractPosition, MetaType, Token } from '~position/position.interface';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { buildPercentageDisplayItem } from '../presentation/display-item.present';

type GetTokenBalancesParams = {
  network: Network;
  appId: string;
  groupId: string;
  address: string;
  resolveBalance?: (opts: { multicall: EthersMulticall; address: string; token: AppTokenPosition }) => Promise<string>;
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
    const share = balance / token.supply;
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

  async getTokenBalances({
    network,
    appId,
    groupId,
    address,
    resolveBalance = async ({ multicall, address, token }) => {
      return await multicall
        .wrap(this.appToolkit.globalContracts.erc20({ network, address: token.address }))
        .balanceOf(address)
        .then(v => v.toString());
    },
  }: GetTokenBalancesParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({ appId, network, groupIds: [groupId] });

    const balances = await Promise.all(
      appTokens.map(async token => {
        const balanceRaw = await resolveBalance({ multicall, address, token });
        const tokenBalance = drillBalance(token, balanceRaw);
        return tokenBalance;
      }),
    );

    return balances.filter(v => v.balance > 0);
  }
}
