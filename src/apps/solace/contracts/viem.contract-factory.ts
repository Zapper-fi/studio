import { Injectable } from '@nestjs/common';
import { PublicClient } from 'viem';

import { Network } from '~types/network.interface';

type ViemNetworkProviderResolver = (network: Network) => PublicClient;

@Injectable()
export class SolaceViemContractFactory {
  constructor(protected readonly networkProviderResolver: ViemNetworkProviderResolver) {}
}
