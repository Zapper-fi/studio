import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { AppTokenPositionBalance, RawTokenBalance } from '~position/position-balance.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { SiloFinanceContractFactory, SiloMarketAsset } from '../contracts';

import { SiloFinanceDefinitionResolver } from './silo-finance.definition-resolver';

export type STokenDataProps = DefaultAppTokenDataProps & {
  siloAddress: string;
};

export type STokenDefinition = {
  address: string;
  siloAddress: string;
};

export abstract class SiloFinanceSTokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  SiloMarketAsset,
  STokenDataProps,
  STokenDefinition
> {
  isExcludedFromBalances = true;
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  abstract siloLensAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SiloFinanceContractFactory) protected readonly contractFactory: SiloFinanceContractFactory,
    @Inject(SiloFinanceDefinitionResolver)
    protected readonly siloDefinitionResolver: SiloFinanceDefinitionResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.siloMarketAsset({ address, network: this.network });
  }

  async getDefinitions(): Promise<STokenDefinition[]> {
    const markets = await this.siloDefinitionResolver.getSiloDefinition(this.network);
    if (!markets) return [];

    const sTokenDefinition = markets
      .map(market => {
        const siloAddress = market.siloAddress;
        const sTokenAddresses = market.marketAssets.map(x => x.sToken);

        return sTokenAddresses.map(address => {
          return {
            address,
            siloAddress,
          };
        });
      })
      .flat();

    return sTokenDefinition;
  }

  async getAddresses({ definitions }: GetAddressesParams<STokenDefinition>): Promise<string[]> {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<SiloMarketAsset>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getDataProps(params: GetDataPropsParams<SiloMarketAsset, STokenDataProps, STokenDefinition>) {
    const defaultDataProps = await super.getDataProps(params);
    const siloAddress = params.definition.siloAddress;
    return { ...defaultDataProps, siloAddress };
  }

  async getRawBalances(address: string): Promise<RawTokenBalance[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const appTokens = await this.appToolkit.getAppTokenPositions<STokenDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const siloLensContract = this.contractFactory.siloLens({ address: this.siloLensAddress, network: this.network });

    return (
      await Promise.all(
        appTokens.map(async appToken => {
          const balanceRaw = await this.getBalancePerToken({ multicall, address, appToken });
          const totalDepositWithInterest = await multicall
            .wrap(siloLensContract)
            .totalDepositsWithInterest(appToken.dataProps.siloAddress, appToken.tokens[0].address);

          return [
            {
              key: this.appToolkit.getPositionKey(appToken),
              balance: balanceRaw.toString(),
            },
            {
              key: `${this.appToolkit.getPositionKey(appToken)}-underlying`,
              balance: totalDepositWithInterest.toString(),
            },
          ];
        }),
      )
    ).flat();
  }

  async drillRawBalances(balances: RawTokenBalance[]): Promise<AppTokenPositionBalance<STokenDataProps>[]> {
    const appTokens = await this.getPositionsForBalances();

    const appTokenBalances = appTokens.map(token => {
      const tokenBalance = balances.find(b => b.key === this.appToolkit.getPositionKey(token));
      const underlyingTokenBalance = balances.find(
        b => b.key === `${this.appToolkit.getPositionKey(token)}-underlying`,
      );

      if (!tokenBalance || !underlyingTokenBalance) return null;

      const result = drillBalance<typeof token, STokenDataProps>(token, tokenBalance.balance);

      const underlyingToken = drillBalance<typeof token, STokenDataProps>(appTokens[0], underlyingTokenBalance.balance);

      return { ...result, tokens: [underlyingToken] };
    });

    return _.compact(appTokenBalances);
  }
}
