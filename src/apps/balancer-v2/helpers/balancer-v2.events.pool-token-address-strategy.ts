import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { hexDataSlice } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

type BalancerV2Factory = {
  address: string;
  fromBlock: number;
};

type BalancerV2EventsPoolTokenDataStrategyParams = {
  factories: BalancerV2Factory[];
};

@Injectable()
export class BalancerV2EventsPoolTokenDataStrategy {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio-balancer-v2-events-pool-token-addresses:${network}:balancer-v2`,
    ttl: 5 * 60,
  })
  async getPoolAddresses(network: Network, factories: BalancerV2Factory[]) {
    const provider = this.appToolkit.getNetworkProvider(network);

    const events = await Promise.all(
      factories.map(factory =>
        provider.getLogs({
          address: factory.address,
          fromBlock: factory.fromBlock,
          toBlock: 'latest',
          topics: [ethers.utils.keccak256('PoolCreated(address)')],
        }),
      ),
    );
    const poolTokenAddresses = events.flat().map(event => hexDataSlice(event.topics[1], 12).toLowerCase());
    return poolTokenAddresses.map(address => ({ address, volume: 0 }));
  }

  build({ factories }: BalancerV2EventsPoolTokenDataStrategyParams) {
    return async ({ network }: { network: Network }) => {
      const poolAddresses = this.getPoolAddresses(network, factories);

      return poolAddresses;
    };
  }
}
