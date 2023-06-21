import { gql } from 'graphql-request';
import { chunk, compact } from 'lodash';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { AppTokenPositionBalance, RawAppTokenBalance } from '~position/position-balance.interface';
import { isAppToken } from '~position/position.interface';

import { UniswapV2DefaultPoolSubgraphTemplateTokenFetcher } from '../common/uniswap-v2.default.subgraph.template.token-fetcher';
import { UniswapV2TokenDataProps } from '../common/uniswap-v2.pool.on-chain.template.token-fetcher';

type UniswapV2BalancesData = {
  user?: {
    liquidityPositions: {
      pair: {
        id: string;
      };
    }[];
  };
};

const UNISWAP_V2_BALANCES_QUERY = gql`
  query getBalances($address: String!) {
    user(id: $address) {
      liquidityPositions {
        pair {
          id
        }
      }
    }
  }
`;

@PositionTemplate()
export class EthereumUniswapV2PoolTokenFetcher extends UniswapV2DefaultPoolSubgraphTemplateTokenFetcher {
  groupLabel = 'Pools';

  factoryAddress = '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-dev';
  ignoredPools = ['0x3016a43b482d0480460f6625115bd372fe90c6bf'];
  first = 5000;
  // Todo: remove when subgraph isn't throwing when calling volumeUSD
  skipVolume = true;

  async getPositionsForBalances() {
    return this.appToolkit.getAppTokenPositionsFromDatabase<UniswapV2TokenDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });
  }

  async getBalances(_address: string): Promise<AppTokenPositionBalance<UniswapV2TokenDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector();
    const address = await this.getAccountAddress(_address);
    if (address === ZERO_ADDRESS) return [];

    // Use the subgraph to determine holdings. Later, we'll optimize this to use our own holdings by default.
    const data = await gqlFetch<UniswapV2BalancesData>({
      endpoint: this.subgraphUrl,
      query: UNISWAP_V2_BALANCES_QUERY,
      variables: { address: address.toLowerCase() },
    });

    const heldTokenAddresses = data.user?.liquidityPositions.map(v => v.pair.id.toLowerCase()) ?? [];
    const heldTokens = await tokenLoader.getMany(heldTokenAddresses.map(t => ({ address: t, network: this.network })));
    const sanitized = compact(heldTokens).filter(isAppToken);

    const balances = await Promise.all(
      sanitized.map(async appToken => {
        const balanceRaw = await this.getBalancePerToken({ multicall, address, appToken });
        const tokenBalance = drillBalance(appToken, balanceRaw.toString(), { isDebt: this.isDebt });
        return tokenBalance;
      }),
    );

    return balances as AppTokenPositionBalance<UniswapV2TokenDataProps>[];
  }

  async getRawBalances(_address: string): Promise<RawAppTokenBalance[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector();
    const address = await this.getAccountAddress(_address);
    if (address === ZERO_ADDRESS) return [];

    // Use the subgraph to determine holdings. Later, we'll optimize this to use our own holdings by default.
    const data = await gqlFetch<UniswapV2BalancesData>({
      endpoint: this.subgraphUrl,
      query: UNISWAP_V2_BALANCES_QUERY,
      variables: { address: address.toLowerCase() },
    });

    const heldTokenAddresses = data.user?.liquidityPositions.map(v => v.pair.id.toLowerCase()) ?? [];
    const heldTokens = await tokenLoader.getMany(heldTokenAddresses.map(t => ({ address: t, network: this.network })));
    const sanitized = compact(heldTokens).filter(isAppToken);

    let results: RawAppTokenBalance[] = [];
    for (const batch of chunk(sanitized, 100).values()) {
      results = results.concat(
        await Promise.all(
          batch.map(async appToken => ({
            key: this.appToolkit.getPositionKey(appToken),
            balance: (await this.getBalancePerToken({ multicall, address, appToken })).toString(),
          })),
        ),
      );
    }
    return results;
  }
}
