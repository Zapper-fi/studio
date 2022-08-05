import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { AAVE_V2_DEFINITION } from '~apps/aave-v2';
import { Cache } from '~cache/cache.decorator';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SUPERFLUID_DEFINITION } from '../superfluid.definition';

const ALL_TOKENS_QUERY = gql`
  {
    tokens {
      id
      symbol
      underlyingAddress
    }
  }
`;

type TokensResponse = {
  tokens?: {
    id: string;
    symbol: string;
    underlyingAddress: string;
  }[];
};

const appId = SUPERFLUID_DEFINITION.id;
const groupId = SUPERFLUID_DEFINITION.groups.vault.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonSuperfluidVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  readonly brokenAddresses = ['0x263026e7e53dbfdce5ae55ade22493f828922965'];

  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  @Cache({
    instance: 'business',
    key: `studio:${SUPERFLUID_DEFINITION.id}:${SUPERFLUID_DEFINITION.groups.vault.id}:${network}:data`,
    ttl: 60 * 60,
  })
  async getTokensInfo() {
    const subgraphUrl = 'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-matic';
    const tokenData = await this.appToolkit.helpers.theGraphHelper.request<TokensResponse>({
      endpoint: subgraphUrl,
      query: ALL_TOKENS_QUERY,
    });
    return tokenData.tokens ?? [];
  }

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    const tokensInfo = await this.getTokensInfo();
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: AAVE_V2_DEFINITION.id,
      groupIds: [AAVE_V2_DEFINITION.groups.supply.id],
      network,
    });

    const tokens = await Promise.all(
      tokensInfo.map(async tokenInfo => {
        if (this.brokenAddresses.includes(tokenInfo.id)) return null;
        const underlyingAddress = tokenInfo.underlyingAddress.toLowerCase();
        const underlyingToken = [...appTokens, ...baseTokens].find(v => v.address === underlyingAddress);
        if (!underlyingToken) return null;

        const contractAddress = tokenInfo.id.toLowerCase();
        const contract = this.appToolkit.globalContracts.erc20({ address: contractAddress, network });
        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        const pricePerShare = 1; // minted 1:1
        const price = underlyingToken.price * pricePerShare;
        const supply = Number(supplyRaw) / 10 ** decimals;
        const liquidity = supply * price;

        // Display Props
        const label = `${underlyingToken.symbol} in Superfluid`;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images =
          underlyingToken.type === ContractType.BASE_TOKEN
            ? [getTokenImg(underlyingToken.address, network)]
            : [...underlyingToken.displayProps.images];
        const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

        const result: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          network,
          address: contractAddress,
          appId,
          groupId: SUPERFLUID_DEFINITION.groups.vault.id,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens: [underlyingToken],

          dataProps: {
            liquidity,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },
        };

        return result;
      }),
    );

    return _.compact(tokens);
  }
}
