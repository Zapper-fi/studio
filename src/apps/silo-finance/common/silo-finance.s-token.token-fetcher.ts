import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { RawTokenBalance } from '~position/position-balance.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDataPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { SiloFinanceContractFactory, SiloMarketAsset } from '../contracts';

import { SiloFinanceDefinitionResolver } from './silo-finance.definition-resolver';

export type ArbitrumSTokenDataProps = {
  liquidity: number;
  reserves: number[];
  apy: number;
  siloAddress: string;
};

export type ArbitrumSTokenDefinition = {
  address: string;
  siloAddress: string;
};

export abstract class SiloFinanceSTokenTokenFetcher extends AppTokenTemplatePositionFetcher<
  SiloMarketAsset,
  ArbitrumSTokenDataProps,
  ArbitrumSTokenDefinition
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

  async getDefinitions(): Promise<ArbitrumSTokenDefinition[]> {
    const marketAssets = await this.siloDefinitionResolver.getMarketAssetTokenDefinition(this.network);
    if (!marketAssets) return [];

    return marketAssets.map(marketAsset => {
      return {
        address: marketAsset.sToken,
        siloAddress: marketAsset.siloAddress,
      };
    });
  }

  async getAddresses({ definitions }: GetAddressesParams<ArbitrumSTokenDefinition>): Promise<string[]> {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<SiloMarketAsset>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getDataProps(params: GetDataPropsParams<SiloMarketAsset, ArbitrumSTokenDataProps, ArbitrumSTokenDefinition>) {
    const defaultDataProps = await super.getDataProps(params);
    const siloAddress = params.definition.siloAddress;
    return { ...defaultDataProps, siloAddress };
  }

  async getRawBalances(address: string): Promise<RawTokenBalance[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const appTokens = await this.appToolkit.getAppTokenPositions<ArbitrumSTokenDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const siloLensContract = this.contractFactory.siloLens({ address: this.siloLensAddress, network: this.network });

    return Promise.all(
      appTokens.map(async appToken => {
        const balanceRaw = await multicall.wrap(this.getContract(appToken.address)).balanceOf(address);
        const totalDepositWithInterest = await multicall
          .wrap(siloLensContract)
          .totalDepositsWithInterest(appToken.dataProps.siloAddress, appToken.tokens[0].address);

        const balance = new BigNumber(balanceRaw.toString())
          .times(totalDepositWithInterest.toString())
          .div(appToken.supply * 10 ** appToken.decimals);

        return {
          key: this.appToolkit.getPositionKey(appToken),
          balance: balance.toString(),
        };
      }),
    );
  }
}
