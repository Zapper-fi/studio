import { Inject } from '@nestjs/common';
import { gql, GraphQLClient } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { borrowed } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ATLENDIS_V_1_DEFINITION } from '../atlendis-v1.definition';
import { AtlendisV1ContractFactory } from '../contracts';

const appId = ATLENDIS_V_1_DEFINITION.id;
const groupId = ATLENDIS_V_1_DEFINITION.groups.position.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonAtlendisV1PositionContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AtlendisV1ContractFactory) private readonly atlendisV1ContractFactory: AtlendisV1ContractFactory,
  ) {}

  async getPositions() {
    const positionManagerAddress = '0x55E4e70a725C1439dac6B9412B71fC8372Bd73e9';

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const endpoint = 'https://atlendis.herokuapp.com/graphql';
    const client = new GraphQLClient(endpoint);

    const query = gql`
      query {
        pools {
          hash
          parameters {
            underlyingToken
          }
          positions {
            tokenId
            normalizedAmount
            lender {
              address
            }
          }
        }
      }
    `;
    const { pools } = await client.request<{
      pools: {
        hash: string;
        parameters: {
          underlyingToken: string;
        };
        positions: {
          tokenId: string;
          normalizedAmount: string;
          lender: {
            address: string;
          };
        }[];
      }[];
    }>(query);

    const tokens = pools.map(pool => {
      const token = baseTokens.find(t => t.address.toLowerCase() === pool.parameters.underlyingToken.toLowerCase());
      if (!token) {
        throw new Error("Oh no, it's broken");
      }
      return token;
    });

    const positionsPerPool = pools.map((pool, poolIndex) => {
      const positions = pool.positions.map(
        (position): ContractPosition => ({
          type: ContractType.POSITION,
          appId,
          groupId,
          address: positionManagerAddress,
          network,
          tokens: [borrowed(tokens[poolIndex])],
          dataProps: {
            tokenId: position.tokenId,
            amount: position.normalizedAmount,
            owner: position.lender.address,
          },
          displayProps: {
            label: position.tokenId,
            images: [],
          },
        }),
      );
      return positions;
    });

    return positionsPerPool.reduce((acc, positions) => [...acc, ...positions], []);
  }
}
