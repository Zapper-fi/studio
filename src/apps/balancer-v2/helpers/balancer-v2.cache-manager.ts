import { Inject, Injectable, Logger } from '@nestjs/common';
import Axios from 'axios';

import { Network } from '~types/network.interface';

// What in the cinnamon toast fuck is this? Gather around children...
// 1. Balancer maintains off-chain claimable amount snapshots in the JSON files described by the `manifestUrl` property
// 2. Originally, Balancer used the `legacyMerkleRedeemAddress` to maintain claim states
// 3. Now, Balancer uses the `merkleOrchardAddress` to maintain claim states (after `weekStart`)
// 4. Gather the states from both to retrieve the full claimable amount state.

// Resources:
// Legacy merkle redeem configurations can be found in https://github.com/balancer-labs/erc20-redeemable
// New merkle orchard configurations can be found in https://github.com/balancer-labs/frontend-v2

export type ClaimableTokenConfig = {
  label: string;
  network: Network;
  legacyMerkleRedeemAddress?: string;
  distributorAddress?: string;
  merkleOrchardAddress?: string;
  rewardTokenAddress: string;
  manifestUrl: string;
  weekStart?: number;
};

type Opts = {
  address: string;
  network: Network;
  rewardTokenAddress: string;
};

@Injectable()
export class BalancerV2CacheManager {
  constructor(@Inject(Logger) private readonly logger: Logger) {}

  async getCachedClaimableAmounts(opts: Opts) {
    const { address, network, rewardTokenAddress } = opts;

    const url = `https://us-west1-zapper-backend.cloudfunctions.net/balancer-v2-claimable`;
    const response = await Axios.get(url, { params: { address, network, rewardTokenAddress } });

    return response.data;
  }
}
