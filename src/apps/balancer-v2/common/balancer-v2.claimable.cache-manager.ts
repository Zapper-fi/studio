import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Network } from '~types/network.interface';

type Opts = {
  address: string;
  network: Network;
  rewardTokenAddress: string;
};

@Injectable()
export class BalancerV2ClaimableCacheManager {
  constructor() {}

  async getCachedClaimableAmounts(opts: Opts): Promise<number[]> {
    const { address, network, rewardTokenAddress } = opts;

    const url = `https://us-west1-zapper-backend.cloudfunctions.net/balancer-v2-claimable`;
    const response = await Axios.get<{ amounts: number[] }>(url, { params: { address, network, rewardTokenAddress } });

    return response.data.amounts;
  }
}
