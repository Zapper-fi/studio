import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { filter } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { DhedgeV2ContractFactory } from '../contracts';
import { DHEDGE_V_2_DEFINITION } from '../dhedge-v2.definition';

const appId = DHEDGE_V_2_DEFINITION.id;
const groupId = DHEDGE_V_2_DEFINITION.groups.pool.id;
const network = Network.POLYGON_MAINNET;

const query = gql`
  query getPools {
    pools {
      id
      name
      tokenPrice
      assets {
        id
      }
    }
  }
`;

interface DHedgeResponse {
  pools: {
    id: string;
    name: string;
    tokenPrice: string;
    assets: { id: string }[];
  }[];
}

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonDhedgeV2PoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(DhedgeV2ContractFactory) private readonly contractFactory: DhedgeV2ContractFactory,
  ) { }

  async getPositions() {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/dhedge/dhedge-v2-polygon';
    const { pools } = await this.appToolkit.helpers.theGraphHelper.request<DHedgeResponse>({ endpoint, query });

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const dUSD = baseTokens.find(t => t.address === '0xbae28251b2a4e621aa7e20538c06dee010bc06de')!;

    const multicall = this.appToolkit.getMulticall(network);

    const tokens = await Promise.all(
      pools.map(async pool => {
        const address = pool.id.toLowerCase();
        const contract = this.contractFactory.erc20({ address, network });

        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);
        const supply = Number(supplyRaw) / 10 ** decimals;
        const tokens = filter(
          pool.assets.map(asset => baseTokens.find(t => t.address === asset.id.toLowerCase().split("-").pop())),
        ) as BaseToken[];
        const pricePerShare = Number(pool.tokenPrice) / 10 ** decimals;
        const price = pricePerShare * dUSD.price;
        const liquidity = supply * price;
        const images = [getAppImg(DHEDGE_V_2_DEFINITION.id)];

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address,
          network,
          symbol,
          decimals,
          supply,
          tokens,
          price,
          pricePerShare,
          dataProps: {
            liquidity,
          },
          displayProps: {
            label: pool.name,
            images,
            statsItems: [
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(liquidity),
              },
            ],
          },
        };

        return token;
      }),
    );

    return tokens;
  }
}
