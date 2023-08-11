import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { UniswapV3LiquidityContractPositionFetcher } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-fetcher';

export type RigoblockPoolAppTokenDefinition = {
  address: string;
};

export abstract class RigoblockPoolContractPositionFetcher extends UniswapV3LiquidityContractPositionFetcher {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<RigoblockPoolAppTokenDefinition[]> {
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: ['pool'],
    });

    return appTokens.map(pool => {
      return {
        poolAddress: pool.address,
      };
    });
  }

  async getPositions(): Promise {
    console.log(this.network, this.network !== undefined);
    return await this.getPositions();
  }
}
