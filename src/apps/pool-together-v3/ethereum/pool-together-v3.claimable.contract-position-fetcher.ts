import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { PoolTogetherV3ClaimableContractPositionFetcher } from '../common/pool-together-v3.claimable.contract-position-fetcher';
import POOL_TOGETHER_V3_DEFINITION from '../pool-together-v3.definition';

@Injectable()
export class EthereumPoolTogetherV3ClaimableContractPositionFetcher extends PoolTogetherV3ClaimableContractPositionFetcher {
  appId = POOL_TOGETHER_V3_DEFINITION.id;
  groupId = POOL_TOGETHER_V3_DEFINITION.groups.claimable.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Rewards';
}
