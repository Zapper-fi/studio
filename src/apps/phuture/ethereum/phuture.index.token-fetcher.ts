import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import _ from 'lodash';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition, Token } from '~position/position.interface';
import { Network } from '~types/network.interface';
import { PhutureContractFactory } from '../contracts';
import { PHUTURE_DEFINITION } from '../phuture.definition';

const appId = PHUTURE_DEFINITION.id;
const appName = PHUTURE_DEFINITION.name;
const groupId = PHUTURE_DEFINITION.groups.index.id;
const network = Network.ETHEREUM_MAINNET;

type AssetDetails = {
  id: string;
  name: string;
  vTokens: {
    platformTotalSupply: number;
    totalAmount: number;
  }[];
};

type IndexDetails = {
  id: string;
  name: string;
  totalSupply: number;
  assets: { shares: number; asset: AssetDetails }[];
  inactiveAssets: { shares: number; asset: AssetDetails }[];
};

const phutureSubgraph = 'https://api.thegraph.com/subgraphs/name/phuture-finance/phuture-v1';

const query = gql`
  query Indexes {
    indexes {
      id
      name
      totalSupply
      assets {
        shares
        asset {
          id
          name
          vTokens {
            platformTotalSupply
            totalAmount
          }
        }
      }
      inactiveAssets {
        shares
        asset {
          id
          name
          vTokens {
            platformTotalSupply
            totalAmount
          }
        }
      }
    }
  }
`;

type QueryResult = {
  indexes: IndexDetails[];
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumPhutureIndexTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PhutureContractFactory) private readonly phutureContractFactory: PhutureContractFactory,
  ) {}

  async getPositions() {
    const indexes = await this.getIndexes();
    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);

    const indexPositions = indexes.map(({ id, name, totalSupply: supply, assets: activeAssets, inactiveAssets }) => {
      const index = baseTokenDependencies.find(({ address }) => address === id);
      if (index === undefined) {
        return null;
      }

      const assets = [...activeAssets, ...inactiveAssets];
      const pricePerShare = assets.map(
        ({
          shares,
          asset: {
            vTokens: [{ platformTotalSupply, totalAmount }],
          },
        }) => ((totalAmount / platformTotalSupply) * shares) / supply,
      );
      let liquidity = 0;

      const tokens: Token[] = _.compact(
        assets.map(({ shares, asset: { id, name } }) => {
          const asset = baseTokenDependencies.find(({ address }) => address === id);
          if (asset === undefined) {
            return null;
          }

          const { price, symbol, decimals } = asset;
          liquidity += shares * price;

          return {
            address: id,
            network,
            price,
            symbol,
            name,
            decimals,
            type: ContractType.BASE_TOKEN,
          };
        }),
      );

      const price = liquidity / supply;
      const secondaryLabel = buildDollarDisplayItem(price);

      const images = tokens.flatMap(token => getImagesFromToken(token));
      const indexPosition: AppTokenPosition = {
        address: id,
        appId,
        dataProps: {
          liquidity,
        },
        decimals: index.decimals,
        displayProps: {
          label: name,
          images,
          appName,
          secondaryLabel,
        },
        groupId,
        network,
        price,
        pricePerShare,
        supply,
        symbol: index.symbol,
        tokens,
        type: ContractType.APP_TOKEN,
      };

      return indexPosition;
    });

    return _.compact(indexPositions);
  }

  private async getIndexes(): Promise<IndexDetails[]> {
    const { indexes } = await this.appToolkit.helpers.theGraphHelper.request<QueryResult>({
      endpoint: phutureSubgraph,
      query,
    });
    return indexes;
  }
}
