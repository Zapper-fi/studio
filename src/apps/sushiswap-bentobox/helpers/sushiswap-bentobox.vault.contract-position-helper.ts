import { Inject, Injectable } from '@nestjs/common';
import request, { gql } from 'graphql-request';
import _ from 'lodash';
import moment from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { Cache } from '~cache/cache.decorator';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SushiswapBentoboxContractFactory } from '../contracts';
import { SUSHISWAP_BENTOBOX_DEFINITION } from '../sushiswap-bentobox.definition';

type TokensResponse = {
  tokens?: {
    id: string;
  }[];
};

const allTokensQuery = gql`
  {
    tokens(first: 500) {
      id
    }
  }
`;

type SushiswapBentoBoxGetPositionParams = {
  bentoBoxAddress: string;
  network: Network;
  subgraphUrl: string;
  dependencies?: AppGroupsDefinition[];
};

const appId = SUSHISWAP_BENTOBOX_DEFINITION.id;
const groupId = SUSHISWAP_BENTOBOX_DEFINITION.groups.vault.id;

@Injectable()
export class SushiSwapBentoBoxContractPositionHelper {
  constructor(
    @Inject(SushiswapBentoboxContractFactory)
    private readonly sushiSwapBentoBoxContractFactory: SushiswapBentoboxContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  @Cache({
    instance: 'business',
    key: ({ network }: { url: string; network: Network }) =>
      `apps-v3:${SUSHISWAP_BENTOBOX_DEFINITION.id}:${network}:api-data`,
    ttl: moment.duration(1, 'hour').asSeconds(),
  })
  private async getBentoBoxTokens(opts: { url: string; network: Network }) {
    const response = await request<TokensResponse>(opts.url, allTokensQuery, {});
    return response.tokens ?? [];
  }

  async getPositions({ bentoBoxAddress, network, subgraphUrl, dependencies = [] }: SushiswapBentoBoxGetPositionParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const allTokens = [...appTokens, ...baseTokens];

    // Get all configured tokens in this Bentobox
    const bentoBoxTokens = await this.getBentoBoxTokens({ url: subgraphUrl, network });

    const positions = await Promise.all(
      bentoBoxTokens.map(async token => {
        const tokenAddress = token.id.toLowerCase();

        const underlyingToken = allTokens.find(p => p.address === tokenAddress);
        if (!underlyingToken) return null;

        const tokenContract = this.sushiSwapBentoBoxContractFactory.erc20({ address: tokenAddress, network });
        const balanceOfRaw = await multicall.wrap(tokenContract).balanceOf(bentoBoxAddress);
        const balanceOf = Number(balanceOfRaw) / 10 ** underlyingToken.decimals;
        const liquidity = balanceOf * underlyingToken.price;

        const position: ContractPosition = {
          type: ContractType.POSITION,
          address: bentoBoxAddress,
          network,
          appId,
          groupId,
          tokens: [supplied(underlyingToken)],
          dataProps: {
            liquidity,
          },
          displayProps: {
            statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
            label: `${underlyingToken.symbol} Deposit`,
            secondaryLabel: buildDollarDisplayItem(underlyingToken.price),
            images: [getTokenImg(underlyingToken.address, network)],
          },
        };

        return position;
      }),
    );

    return _.compact(positions);
  }
}
