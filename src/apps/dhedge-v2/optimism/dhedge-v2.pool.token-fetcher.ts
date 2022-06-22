import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { Erc20 } from '~contract/contracts';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { DhedgeV2ContractFactory } from '../contracts';
import { DHEDGE_V_2_DEFINITION } from '../dhedge-v2.definition';

const appId = DHEDGE_V_2_DEFINITION.id;
const groupId = DHEDGE_V_2_DEFINITION.groups.pool.id;
const network = Network.OPTIMISM_MAINNET;

const query = gql`
  query getPools {
    pools {
      id
      name
      tokenPrice
    }
  }
`;

interface DHedgeResponse {
  pools: {
    id: string;
    name: string;
    tokenPrice: string;
  }[];
}

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismDhedgeV2PoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(DhedgeV2ContractFactory) private readonly contractFactory: DhedgeV2ContractFactory,
  ) {}

  async getPositions() {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/dhedge/dhedge-v2-optimism';
    const { pools } = await this.appToolkit.helpers.theGraphHelper.request<DHedgeResponse>({ endpoint, query });

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const sUSD = baseTokens.find(t => t.symbol === 'sUSD')!;

    return await this.appToolkit.helpers.vaultTokenHelper.getTokens<Erc20>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => pools.map(p => p.id.toLowerCase()),
      resolveContract: ({ address, network }) => this.contractFactory.erc20({ address, network }),
      resolveUnderlyingTokenAddress: () => sUSD.address, // TODO: get actual underlying tokens
      resolveReserve: () => 0,
      resolvePricePerShare: async ({ underlyingToken, contract }) => {
        const pool = pools.find(p => p.id.toLowerCase() === contract.address)!;
        return Number(pool.tokenPrice) / 10 ** underlyingToken.decimals;
      },
    });
  }
}
