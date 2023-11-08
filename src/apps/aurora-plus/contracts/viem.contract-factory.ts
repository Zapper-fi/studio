import { Injectable } from '@nestjs/common';
import { PublicClient } from 'viem';

import { Network } from '~types/network.interface';

type ViemNetworkProviderResolver = (network: Network) => PublicClient;

@Injectable()
export class AuroraPlusViemContractFactory {
  constructor(protected readonly networkProviderResolver: ViemNetworkProviderResolver) {}
}
