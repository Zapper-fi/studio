import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { BALANCER_V2_DEFINITION } from '~apps/balancer-v2';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AURA_DEFINITION } from '../aura.definition';

type Pools = {
  pools: {
    depositToken: {
      id: string;
      symbol: string;
      name: string;
      decimals: number;
    };
    lpToken: {
      id: string;
      symbol: string;
      name: string;
      decimals: number;
    };
    totalSupply: string;
  }[];
};

const appId = AURA_DEFINITION.id;
const groupId = AURA_DEFINITION.groups.deposit.id;
const network = Network.ETHEREUM_MAINNET;

const QUERY = gql`
  {
    pools(where: { isFactoryPool: true }) {
      depositToken {
        id
        symbol
        name
        decimals
      }
      lpToken {
        id
        symbol
        decimals
        name
      }
      totalSupply
      rewardPool
    }
  }
`;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAuraDepositTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions() {
    const appTokens = await this.appToolkit.getAppTokenPositions(
      { appId: BALANCER_V2_DEFINITION.id, groupIds: [BALANCER_V2_DEFINITION.groups.pool.id], network },
      { appId: AURA_DEFINITION.id, groupIds: [AURA_DEFINITION.groups.chef.id], network },
    );

    const { pools } = await this.appToolkit.helpers.theGraphHelper.request<Pools>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/aurafinance/aura',
      query: QUERY,
    });

    // Aura platform deposit tokens (e.g. aBPT tokens)
    const depositTokens = pools.map<AppTokenPosition | null>(
      ({ depositToken, lpToken: { id: lpTokenAddress }, totalSupply }) => {
        const address = depositToken.id.toLowerCase();
        const { decimals, symbol } = depositToken;

        const lpToken = appTokens.find(token => token.address.toLowerCase() === lpTokenAddress.toLowerCase());
        if (!lpToken) return null;

        const supply = Number(totalSupply) / 10 ** decimals;

        return {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          network,
          address,
          decimals,
          symbol,
          supply,
          price: lpToken.price,
          pricePerShare: 1,
          tokens: [lpToken],
          dataProps: {},
          displayProps: {
            label: getLabelFromToken(lpToken),
            images: getImagesFromToken(lpToken),
          },
        };
      },
    );

    return compact(depositTokens);
  }
}
