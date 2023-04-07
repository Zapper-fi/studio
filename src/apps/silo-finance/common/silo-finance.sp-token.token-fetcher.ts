import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { RawTokenBalance } from '~position/position-balance.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { SiloFinanceContractFactory, SiloMarketAsset } from '../contracts';

import { SiloFinanceDefinitionResolver } from './silo-finance.definition-resolver';

export type SpTokenDataProps = DefaultAppTokenDataProps & {
  siloAddress: string;
};

export type SpTokenDefinition = {
  address: string;
  siloAddress: string;
};

export abstract class SiloFinanceSpTokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  SiloMarketAsset,
  SpTokenDataProps,
  SpTokenDefinition
> {
  isExcludedFromBalances = true;
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

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

  async getDefinitions(): Promise<SpTokenDefinition[]> {
    const markets = await this.siloDefinitionResolver.getSiloDefinitions(this.network);
    if (!markets) return [];

    return markets.flatMap(market =>
      market.marketAssets.map(marketAsset => ({
        siloAddress: market.siloAddress,
        address: marketAsset.spToken,
      })),
    );
  }

  async getAddresses({ definitions }: GetAddressesParams<SpTokenDefinition>): Promise<string[]> {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<SiloMarketAsset>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getDataProps(params: GetDataPropsParams<SiloMarketAsset, SpTokenDataProps, SpTokenDefinition>) {
    const defaultDataProps = await super.getDataProps(params);
    const siloAddress = params.definition.siloAddress;
    return { ...defaultDataProps, siloAddress };
  }

  async getRawBalances(address: string): Promise<RawTokenBalance[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const appTokens = await this.appToolkit.getAppTokenPositions<SpTokenDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    return Promise.all(
      appTokens.map(async appToken => {
        const balanceRaw = await multicall.wrap(this.getContract(appToken.address)).balanceOf(address);

        const siloContract = this.contractFactory.silo({
          address: appToken.dataProps.siloAddress,
          network: this.network,
        });

        const assetStorage = await multicall.wrap(siloContract).assetStorage(appToken.tokens[0].address);
        const collateralOnlyDeposits = assetStorage.collateralOnlyDeposits;

        const balance = new BigNumber(balanceRaw.toString())
          .times(collateralOnlyDeposits.toString())
          .div(appToken.supply * 10 ** appToken.decimals);

        return {
          key: this.appToolkit.getPositionKey(appToken),
          balance: balance.toString(),
        };
      }),
    );
  }
}
