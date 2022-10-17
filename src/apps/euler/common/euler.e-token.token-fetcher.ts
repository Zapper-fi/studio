import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenPositionBalance } from '~position/position-balance.interface';
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
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<EulerEtokenContract>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy({ appToken }: GetDataPropsParams<EulerEtokenContract>) {
    const market = await this.tokenDefinitionsResolver.getMarket(appToken.address, this.tokenType);
    return (Number(market!.supplyAPY) * 100) / 1e27;
  }

  async getBalances(address: string): Promise<AppTokenPositionBalance<DefaultAppTokenDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const appTokens = await this.appToolkit.getAppTokenPositions<DefaultAppTokenDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      appTokens.map(async appToken => {
        const balanceRaw = await this.getBalancePerToken({ multicall, address, appToken });
        const underlyingBalance = await multicall
          .wrap(this.getContract(appToken.address))
          .convertBalanceToUnderlying(balanceRaw);

        const appTokenBalance = drillBalance(appToken, balanceRaw.toString());
        const tokenBalance = drillBalance(appToken.tokens[0], underlyingBalance.toString());
        return { ...appTokenBalance, tokens: [tokenBalance] };
      }),
    );

    return balances as AppTokenPositionBalance<DefaultAppTokenDataProps>[];
  }
}
