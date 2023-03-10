import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildPercentageDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps, StatsItem } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';

import { Silo, SiloFinanceContractFactory } from '../contracts';

import { SiloFinanceDefinitionResolver } from './silo-finance.definition-resolver';

type SiloContractPositionDefinition = {
  address: string;
  name: string;
  assets: string[];
  underlyingTokens: string[];
};

type SiloContractPositionDataProps = DefaultDataProps & {
  supplyApys: BigNumberish[];
  borrowApys: BigNumberish[];
};

export abstract class SiloFinanceSiloContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  Silo,
  SiloContractPositionDataProps,
  SiloContractPositionDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SiloFinanceContractFactory) protected readonly contractFactory: SiloFinanceContractFactory,
    @Inject(SiloFinanceDefinitionResolver)
    protected readonly siloDefinitionResolver: SiloFinanceDefinitionResolver,
  ) {
    super(appToolkit);
  }

  abstract siloLensAddress: string;

  getContract(address: string): Silo {
    return this.contractFactory.silo({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<SiloContractPositionDefinition[]> {
    const data = await this.siloDefinitionResolver.getSiloDefinition(this.network);
    if (!data) return [];

    const definitions = await Promise.all(
      data.markets.map(async market => {
        const siloAddress = market.id;
        const siloContract = this.getContract(siloAddress);
        const assets = await siloContract.getAssets();
        const assetStorages = await Promise.all(assets.map(asset => multicall.wrap(siloContract).assetStorage(asset)));
        const underlyingTokens = assetStorages
          .map(assetStorage => [
            assetStorage.collateralToken.toLowerCase(),
            assetStorage.collateralOnlyToken.toLowerCase(),
            assetStorage.debtToken.toLowerCase(),
          ])
          .flat();
        return {
          address: siloAddress,
          name: market.name,
          underlyingTokens,
          assets: assets.map(x => x.toLowerCase()),
        };
      }),
    );

    return definitions;
  }

  async getDataProps({
    contractPosition,
    definition,
    multicall,
  }: GetDataPropsParams<
    Silo,
    SiloContractPositionDataProps,
    SiloContractPositionDefinition
  >): Promise<SiloContractPositionDataProps> {
    const siloLensContract = this.contractFactory.siloLens({ address: this.siloLensAddress, network: this.network });

    const supplyApys = await Promise.all(
      definition.assets.map(asset => multicall.wrap(siloLensContract).depositAPY(contractPosition.address, asset)),
    );
    const borrowApys = await Promise.all(
      definition.assets.map(asset => multicall.wrap(siloLensContract).borrowAPY(contractPosition.address, asset)),
    );

    return {
      supplyApys,
      borrowApys,
    };
  }

  async getStatsItems({
    contractPosition: { dataProps, tokens },
    definition,
  }: GetDisplayPropsParams<Silo, SiloContractPositionDataProps, SiloContractPositionDefinition>): Promise<
    StatsItem[] | undefined
  > {
    return definition.assets
      .map((_, idx) => {
        const tokenLabel = getLabelFromToken(tokens[idx * 3]);
        return [
          {
            label: `${tokenLabel} Supply APY`,
            value: buildPercentageDisplayItem(+formatEther(dataProps.supplyApys[idx]) * 100),
          },
          {
            label: `${tokenLabel} Borrow APY`,
            value: buildPercentageDisplayItem(+formatEther(dataProps.borrowApys[idx]) * 100),
          },
        ];
      })
      .flat();
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<Silo, SiloContractPositionDefinition>): Promise<UnderlyingTokenDefinition[] | null> {
    return definition.assets
      .map((_asset, idx) => {
        const underlyingTokenId = idx * 3;
        return [
          {
            address: definition.underlyingTokens[underlyingTokenId],
            network: this.network,
            metaType: MetaType.SUPPLIED, // sTOKEN
          },
          {
            address: definition.underlyingTokens[underlyingTokenId + 1],
            network: this.network,
            metaType: MetaType.SUPPLIED, // spTOKEN
          },
          {
            address: definition.underlyingTokens[underlyingTokenId + 2],
            network: this.network,
            metaType: MetaType.BORROWED, // dTOKEN
          },
        ];
      })
      .flat();
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<Silo, SiloContractPositionDataProps, SiloContractPositionDefinition>): Promise<string> {
    return `${definition.name} Silo`;
  }

  getTokenBalancesPerPosition({
    address,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<Silo, SiloContractPositionDataProps>): Promise<BigNumberish[]> {
    return Promise.all(
      contractPosition.tokens.map(async token => {
        const underlyingTokenContract = this.contractFactory.siloMarketAsset({
          address: token.address,
          network: this.network,
        });

        const tokenBalance = await multicall.wrap(underlyingTokenContract).balanceOf(address);
        if (tokenBalance.eq(0)) return BigNumber.from(0);

        return tokenBalance;
      }),
    );
  }
}
