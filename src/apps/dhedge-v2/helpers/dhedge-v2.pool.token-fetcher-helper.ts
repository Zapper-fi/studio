import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Erc20 } from '~contract/contracts';
import { Network } from '~types/network.interface';
import { getAppAssetImage, getAppImg } from '~app-toolkit/helpers/presentation/image.present';

import { DhedgeV2ContractFactory } from '../contracts';
import { DHEDGE_V_2_DEFINITION } from '../dhedge-v2.definition';

const appId = DHEDGE_V_2_DEFINITION.id;
const groupId = DHEDGE_V_2_DEFINITION.groups.pool.id;

const query = gql`
  query getPools {
    pools {
      id
      tokenPrice
    }
  }
`;

interface DHedgeResponse {
  pools: {
    id: string;
    tokenPrice: string;
  }[];
}

const customImg = new Set<string>([
  'BEAR',
  'BTCy',
  'BULL',
  'dSNX',
  'USDy',
  'mlETH',
  'USDmny',
  'dUSD',
])

@Injectable()
export class DhedgeV2PoolTokenFetcherHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(DhedgeV2ContractFactory) private readonly contractFactory: DhedgeV2ContractFactory,
  ) { }

  async getPositions({ network }) {
    const endpoint = `https://api.thegraph.com/subgraphs/name/dhedge/dhedge-v2-${network}`;
    console.log(endpoint);
    const { pools } = await this.appToolkit.helpers.theGraphHelper.request<DHedgeResponse>({ endpoint, query });
    const underlyingTokenAddress = (network === Network.OPTIMISM_MAINNET) ?
      '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9' : // optimism sUSD
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // polygon USDC

    return await this.appToolkit.helpers.vaultTokenHelper.getTokens<Erc20>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => pools.map(p => p.id.toLowerCase()),
      resolveContract: ({ address, network }) => this.contractFactory.erc20({ address, network }),
      resolveUnderlyingTokenAddress: () => underlyingTokenAddress,
      resolveReserve: () => 0,
      resolveImages: ({ symbol }) => {
        for (const img of customImg) {
          if (symbol.includes(img)) {
            return [getAppAssetImage(appId, img)];
          }
        }
        return [getAppImg(appId)];
      },
      resolvePricePerShare: async ({ underlyingToken, contract }) => {
        const pool = pools.find(p => p.id.toLowerCase() === contract.address)!;
        return Number(pool.tokenPrice) / 10 ** underlyingToken.decimals;
      },
    });
  }
}
