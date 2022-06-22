import { Inject } from '@nestjs/common';
import request, { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { VVS_FINANCE_DEFINITION } from '../vvs-finance.definition';

const graphEndpoint = 'https://graph.cronoslabs.com/subgraphs/name/vvs/exchange';
const vvsFactoriesQuery = gql`
  query vvsFactories($tokenId: String) {
    vvsFactories(start: 1) {
      totalLiquidityUSD
    }
  }
`;

interface VvsFactoriesQueryResult {
  vvsFactories: {
    totalLiquidityUSD: string;
  }[];
}

const CRAFTSMAN_CONTRACT_ADDRESS = '0xDccd6455AE04b03d785F12196B492b18129564bc';
const VVS_TOKEN_ADDRESS = '0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03';
const network = Network.CRONOS_MAINNET;

@Register.TvlFetcher({ appId: VVS_FINANCE_DEFINITION.id, network })
export class CronosVvsFinanceTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly toolkit: IAppToolkit) {}

  async getTvl() {
    const multicall = this.toolkit.getMulticall(network);
    const contract = this.toolkit.globalContracts.erc20({
      address: VVS_TOKEN_ADDRESS,
      network,
    });

    const [vvsFactories, vvsToken, stakedVvsBalance] = await Promise.all([
      request<VvsFactoriesQueryResult>(graphEndpoint, vvsFactoriesQuery, { tokenId: VVS_TOKEN_ADDRESS.toLowerCase() }),
      this.toolkit.getBaseTokenPrice({
        address: VVS_TOKEN_ADDRESS,
        network,
      }),
      multicall.wrap(contract).balanceOf(CRAFTSMAN_CONTRACT_ADDRESS),
    ]);

    if (!vvsToken) return 0;

    const tvlInFactories = Number(vvsFactories.vvsFactories[0].totalLiquidityUSD);
    const stakedTvl = this.toolkit
      .getBigNumber(stakedVvsBalance)
      .div(10 ** vvsToken.decimals)
      .multipliedBy(vvsToken.price)
      .toNumber();

    return tvlInFactories + stakedTvl;
  }
}
