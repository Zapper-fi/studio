import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';
import _ from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenPositionBalance, RawTokenBalance } from '~position/position-balance.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetAddressesParams,
  GetDataPropsParams,
  DefaultAppTokenDataProps,
  GetPricePerShareParams,
} from '~position/template/app-token.template.types';

import { EulerContractFactory, EulerEtokenContract } from '../contracts';

import { EulerTokenDefinition, EulerTokenDefinitionsResolver, EulerTokenType } from './euler.token-definition-resolver';

export abstract class EulerETokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  EulerEtokenContract,
  DefaultAppTokenDataProps,
  EulerTokenDefinition
> {
  abstract tokenType: EulerTokenType;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(EulerTokenDefinitionsResolver)
    private readonly tokenDefinitionsResolver: EulerTokenDefinitionsResolver,
    @Inject(EulerContractFactory) protected readonly contractFactory: EulerContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): EulerEtokenContract {
    return this.contractFactory.eulerEtokenContract({ network: this.network, address });
  }

  async getDefinitions(): Promise<EulerTokenDefinition[]> {
    return this.tokenDefinitionsResolver.getTokenDefinitions(this.tokenType);
  }

  async getAddresses({ definitions }: GetAddressesParams<EulerTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<EulerEtokenContract, EulerTokenDefinition>) {
    return definition.underlyingTokenAddress;
  }

  async getSymbol({ address }): Promise<string> {
    const market = await this.tokenDefinitionsResolver.getMarket(address, this.tokenType);
    return `E${market!.symbol}`;
  }

  async getPricePerShare({
    contract,
    multicall,
    appToken,
  }: GetPricePerShareParams<EulerEtokenContract>): Promise<number> {
    const pricePerShareRaw = await multicall
      .wrap(contract)
      .convertBalanceToUnderlying(ethers.BigNumber.from(10).pow(18));
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;

    return pricePerShare;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<EulerEtokenContract>) {
    return (this.isDebt ? -1 : 1) * appToken.price * appToken.supply;
  }

  async getReserves({ appToken }: GetDataPropsParams<EulerEtokenContract>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy({ appToken }: GetDataPropsParams<EulerEtokenContract>) {
    const market = await this.tokenDefinitionsResolver.getMarket(appToken.address, this.tokenType);
    return (Number(market!.supplyAPY) * 100) / 1e27;
  }

  async getRawBalances(address: string): Promise<RawTokenBalance[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const appTokens = await this.appToolkit.getAppTokenPositions<DefaultAppTokenDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    return (
      await Promise.all(
        appTokens.map(async appToken => {
          const balanceRaw = await this.getBalancePerToken({ multicall, address, appToken });
          const underlyingBalance = await multicall
            .wrap(this.getContract(appToken.address))
            .convertBalanceToUnderlying(balanceRaw);

          return [
            {
              key: this.appToolkit.getPositionKey(appToken),
              balance: (await this.getBalancePerToken({ multicall, address, appToken })).toString(),
            },
            {
              key: `${this.appToolkit.getPositionKey(appToken)}-underlying`,
              balance: underlyingBalance.toString(),
            },
          ];
        }),
      )
    ).flat();
  }

  async drillRawBalances(balances: RawTokenBalance[]): Promise<AppTokenPositionBalance<DefaultAppTokenDataProps>[]> {
    const appTokens = await this.getPositionsForBalances();

    const appTokenBalances = appTokens.map(token => {
      const tokenBalance = balances.find(b => b.key === this.appToolkit.getPositionKey(token));
      const underlyingTokenBalance = balances.find(
        b => b.key === `${this.appToolkit.getPositionKey(token)}-underlying`,
      );

      if (!tokenBalance || !underlyingTokenBalance) return null;

      const result = drillBalance<typeof token, DefaultAppTokenDataProps>(token, tokenBalance.balance, {
        isDebt: this.isDebt,
      });

      const underlyingToken = drillBalance<typeof token, DefaultAppTokenDataProps>(
        appTokens[0],
        underlyingTokenBalance.balance,
      );

      return { ...result, tokens: [underlyingToken] };
    });

    return _.compact(appTokenBalances);
  }
}
