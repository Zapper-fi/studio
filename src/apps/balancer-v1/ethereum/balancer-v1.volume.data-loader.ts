import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { BalancerV1PoolSubgraphVolumeDataLoader } from '../common/balancer-v1.volume.data-loader';

@Injectable()
export class EthereumBalancerV1PoolSubgraphVolumeDataLoader extends BalancerV1PoolSubgraphVolumeDataLoader {
  network = Network.ETHEREUM_MAINNET;
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer';
}
