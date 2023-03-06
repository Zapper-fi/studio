import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildPercentageDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DefaultDataProps, StatsItem } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';

import { Silo, SiloFinanceContractFactory, SiloLens } from '../contracts';
import { IBaseSilo } from '../contracts/ethers/Silo';

const GETSILOS_QUERY = gql`
  query GetSilos {
    markets(orderBy: totalValueLockedUSD, orderDirection: desc, where: { inputToken_: { activeOracle_not: "null" } }) {
      id
      name
      isActive
      inputToken {
        symbol
      }
      outputToken {
        symbol
      }
      __typename
    }
  }
`;

type SiloContractPositionDefinition = DefaultContractPositionDefinition & {
  assets: string[];
  tokens: string[][];
  tokensFlattened: string[];
  assetStorages: IBaseSilo.AssetStorageStructOutput[];
};

type SiloContractPositionDataProps = DefaultDataProps & {
  totalUnderlyings: BigNumberish[];
  totalShares: BigNumberish[];
  supplyApys: BigNumberish[];
  borrowApys: BigNumberish[];
  tokensFlattened: string[];
};

export abstract class SiloFinanceSiloContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  Silo,
  SiloContractPositionDataProps,
  SiloContractPositionDefinition
> {
  groupLabel: string;
  appId = 'silo-finance';
  groupId = 'silo';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SiloFinanceContractFactory) protected readonly siloFinanceContractFactory: SiloFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  abstract getSubgraphUrl(): string;

  abstract getSiloLens(): SiloLens;

  getContract(address: string): Silo {
    return this.siloFinanceContractFactory.silo({ address, network: this.network });
  }

  async getDefinitions(params: GetDefinitionsParams): Promise<SiloContractPositionDefinition[]> {
    const data = await gqlFetch({
      endpoint: this.getSubgraphUrl(),
      query: GETSILOS_QUERY,
    });

    const definitions = await Promise.all(
      data.markets.map(async i => {
        const siloAddress = i.id;
        const siloContract = this.getContract(siloAddress);
        const assets = await siloContract.getAssets();
        const assetStorages = await Promise.all(
          assets.map(asset => params.multicall.wrap(siloContract).assetStorage(asset)),
        );
        const tokens = assetStorages.map(assetStorage => [
          assetStorage.collateralToken,
          assetStorage.collateralOnlyToken,
          assetStorage.debtToken,
        ]);
        return {
          address: siloAddress,
          tokens: tokens,
          tokensFlattened: tokens.flat(),
          network: this.network,
          assets: assets,
          assetStorages: assetStorages,
        };
      }),
    );

    // console.log('definitions', definitions);
    return definitions;
  }

  async getDataProps(
    params: GetDataPropsParams<Silo, SiloContractPositionDataProps, SiloContractPositionDefinition>,
  ): Promise<SiloContractPositionDataProps> {
    const siloLens = this.getSiloLens();
    const definition = params.definition;

    const tokenContractsFlattened = definition.tokensFlattened.map(token =>
      this.siloFinanceContractFactory.erc20({ address: token, network: this.network }),
    );
    const totalShares = await Promise.all(
      tokenContractsFlattened.map(tokenContract => params.multicall.wrap(tokenContract).totalSupply()),
    );
    const totalUnderlyings = await Promise.all(
      definition.tokens.map(async (_, idx) => {
        const asset = definition.assets[idx];
        const assetStorage = definition.assetStorages[idx];
        const totalDepositWithInterest = await siloLens.totalDepositsWithInterest(params.address, asset);
        const totalBorrowsWithInterest = await siloLens.totalBorrowAmountWithInterest(params.address, asset);
        return [totalDepositWithInterest, assetStorage.collateralOnlyDeposits, totalBorrowsWithInterest];
      }),
    );
    const supplyApys = await Promise.all(
      definition.assets.map(asset => params.multicall.wrap(siloLens).depositAPY(params.address, asset)),
    );
    const borrowApys = await Promise.all(
      definition.assets.map(asset => params.multicall.wrap(siloLens).borrowAPY(params.address, asset)),
    );

    return {
      totalUnderlyings: totalUnderlyings.flat(),
      totalShares: totalShares,
      supplyApys: supplyApys,
      borrowApys: borrowApys,
      tokensFlattened: definition.tokensFlattened,
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

  async getTokenDefinitions(
    params: GetTokenDefinitionsParams<Silo, SiloContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return params.definition.assets
      .map(asset => {
        return [
          {
            address: asset,
            network: this.network,
            metaType: MetaType.SUPPLIED, // sTOKEN
          },
          {
            address: asset,
            network: this.network,
            metaType: MetaType.SUPPLIED, // spTOKEN
          },
          {
            address: asset,
            network: this.network,
            metaType: MetaType.BORROWED, // dTOKEN
          },
        ];
      })
      .flat();
  }

  async getLabel(
    params: GetDisplayPropsParams<Silo, SiloContractPositionDataProps, SiloContractPositionDefinition>,
  ): Promise<string> {
    const siloAsset = await params.contract.siloAsset();
    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: `${this.appId}__template` },
    });
    const siloAssetToken = await tokenLoader.getOne({ address: siloAsset, network: this.network });
    return `${siloAssetToken?.symbol || siloAsset} Silo`;
  }

  getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<Silo, SiloContractPositionDataProps>,
  ): Promise<BigNumberish[]> {
    const dataProps = params.contractPosition.dataProps;

    return Promise.all(
      params.contractPosition.tokens.map(async (_, idx) => {
        const token = this.siloFinanceContractFactory.erc20({
          address: dataProps.tokensFlattened[idx],
          network: this.network,
        });
        const tokenBalance = await token.balanceOf(params.address);
        const totalSupply = dataProps.totalShares[idx];
        const totalUnderlying = dataProps.totalUnderlyings[idx];
        if (tokenBalance.eq(0)) return BigNumber.from(0);
        // console.log(idx, tokenBalance, totalUnderlying, totalSupply);
        return tokenBalance.mul(totalUnderlying).div(totalSupply);
      }),
    );
  }
}
