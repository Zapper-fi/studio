import { Injectable } from '@nestjs/common';
import { PublicClient } from 'viem';

import { Network } from '~types/network.interface';

import { Erc1155__factory, Erc20__factory, Erc4626__factory, Erc721__factory, Multicall__factory } from './viem';

type ContractOpts = { address: string; network: Network };
type ViemNetworkProviderResolver = (network: Network) => PublicClient;

@Injectable()
export class ContractViemContractFactory {
  constructor(protected readonly networkProviderResolver: ViemNetworkProviderResolver) {}

  erc1155({ address, network }: ContractOpts) {
    return Erc1155__factory.connect(address, this.networkProviderResolver(network));
  }
  erc20({ address, network }: ContractOpts) {
    return Erc20__factory.connect(address, this.networkProviderResolver(network));
  }
  erc4626({ address, network }: ContractOpts) {
    return Erc4626__factory.connect(address, this.networkProviderResolver(network));
  }
  erc721({ address, network }: ContractOpts) {
    return Erc721__factory.connect(address, this.networkProviderResolver(network));
  }
  multicall({ address, network }: ContractOpts) {
    return Multicall__factory.connect(address, this.networkProviderResolver(network));
  }
}
