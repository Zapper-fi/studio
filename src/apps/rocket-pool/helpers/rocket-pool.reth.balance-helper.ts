import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { ROCKET_POOL_DEFINITION } from '../rocket-pool.definition';

@Injectable()
export class RocketPoolRethBalanceHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getBalances(address: string) {
    return [
      {
        label: 'Rocket Pool ETH',
        assets: await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
          address,
          appId: ROCKET_POOL_DEFINITION.id,
          groupId: ROCKET_POOL_DEFINITION.groups.reth.id,
          network: Network.ETHEREUM_MAINNET,
        }),
      },
    ];
  }
}
