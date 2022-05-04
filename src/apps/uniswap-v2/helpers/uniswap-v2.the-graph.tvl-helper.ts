import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

type UniswapV2TheGraphTvlHelperParams = {
  subgraphUrl: string;
  factoryObjectName?: string;
  tvlObjectName?: string;
};

@Injectable()
export class UniswapV2TheGraphTvlHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl({
    subgraphUrl,
    factoryObjectName = 'uniswapFactories',
    tvlObjectName = 'totalLiquidityUSD',
  }: UniswapV2TheGraphTvlHelperParams) {
    const query = gql`
      query getTvl {
        ${factoryObjectName} {
          ${tvlObjectName}
        }
      }
    `;

    const data = await this.appToolkit.helpers.theGraphHelper.request({ endpoint: subgraphUrl, query });
    const tvl = data[factoryObjectName]?.[0]?.[tvlObjectName] ?? 0;
    return Number(tvl);
  }
}
