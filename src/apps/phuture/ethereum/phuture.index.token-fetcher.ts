import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
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
  symbol: string;
  name: string;
  decimals: number;
};

type IndexDetails = {
  id: string;
  decimals: number;
  symbol: string;
  name: string;
  totalSupply: number;
  assets: Record<'asset', AssetDetails>[];
};

const phutureSubgraph = 'https://api.thegraph.com/subgraphs/name/phuture-finance/phuture-v1';

const query = gql`
  query Indexes {
    indexes {
      id
      decimals
      symbol
      name
      totalSupply
      assets {
        asset {
          id
          symbol
          name
          decimals
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
    const { indexes } = await this.getIndexes();

    const indexPositions = indexes.map(({ id, decimals, symbol, name, totalSupply: supply, assets }) => {
      const price = 0; // TODO: get price

      const pricePerShare = price; // TODO: calculate price per share

      const tokens: Token[] = assets.map(({ asset: { id, symbol, name, decimals } }) => ({
        address: id,
        network,
        price: 0, // TODO: get price
        symbol,
        name,
        decimals,
        type: ContractType.BASE_TOKEN,
      }));

      const images = []; // TODO: get images from github tokensets

      const secondaryLabel = buildDollarDisplayItem(price);

      const tertiaryLabel = `100% APY`; // TODO: calculate APY

      const indexPosition: AppTokenPosition = {
        address: id,
        appId,
        dataProps: {},
        decimals,
        displayProps: {
          label: name,
          images,
          appName,
          secondaryLabel,
          tertiaryLabel,
        },
        groupId,
        network,
        price,
        pricePerShare,
        supply,
        symbol,
        tokens,
        type: ContractType.APP_TOKEN,
      };

      return indexPosition;
    });

    return _.compact(indexPositions);
  }

  private async getIndexes(): Promise<QueryResult> {
    return await this.appToolkit.helpers.theGraphHelper.request<QueryResult>({
      endpoint: phutureSubgraph,
      query,
    });
  }
}
