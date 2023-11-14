import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types';

import { TokemakViemContractFactory } from '../contracts';

type ClaimableDataResponse = {
  payload: {
    wallet: string;
    cycle: number;
    amount: string;
    chainId: number;
  };
};

@Injectable()
export class TokemakClaimableResolver {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TokemakViemContractFactory) private readonly contractFactory: TokemakViemContractFactory,
  ) {}

  @Cache({
    key: `studio:tokemak:farm:ethereum:cycle-rewards-hash`,
    ttl: 15 * 60, // 15 min
  })
  private async getCycleRewardsHash() {
    const network = Network.ETHEREUM_MAINNET;
    const multicall = this.appToolkit.getViemMulticall(network);
    const rewardsHashContract = this.contractFactory.tokemakRewardsHash({
      network,
      address: '0x5ec3ec6a8ac774c7d53665ebc5ddf89145d02fb6',
    });

    const currentCycleIndex = await multicall
      .wrap(rewardsHashContract)
      .read.latestCycleIndex()
      .catch(() => BigInt(0));

    const [latestClaimableRewardsHash, currentCycleRewardsHash] = await multicall
      .wrap(rewardsHashContract)
      .read.cycleHashes([currentCycleIndex])
      .catch(() => [null, null]);

    return [latestClaimableRewardsHash, currentCycleRewardsHash];
  }

  @Cache({
    key: (address: string) => `studio:tokemak:claimable:ethereum:${address}`,
    ttl: 5 * 60, // 5 min
  })
  async getClaimableBalanceData(address: string) {
    const [latestClaimableRewardsHash] = await this.getCycleRewardsHash();
    const url = `https://ipfs.tokemaklabs.xyz/ipfs/${latestClaimableRewardsHash}/${address.toLowerCase()}.json`;
    const data: ClaimableDataResponse['payload'] | null = await Axios.get<ClaimableDataResponse>(url)
      .then(t => t.data.payload)
      .catch(() => null);
    return data;
  }
}
