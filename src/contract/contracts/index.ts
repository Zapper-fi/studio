import { Injectable, Inject } from '@nestjs/common';

import { NetworkProviderService } from '~network-provider/network-provider.service';
import { Network } from '~types/network.interface';

import { Erc1155__factory } from './ethers';
import { Erc20__factory } from './ethers';
import { Erc721__factory } from './ethers';
import { Multicall__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ContractFactory {
  constructor(@Inject(NetworkProviderService) protected readonly networkProviderService: NetworkProviderService) {}

  erc1155({ address, network }: ContractOpts) {
    return Erc1155__factory.connect(address, this.networkProviderService.getProvider(network));
  }
  erc20({ address, network }: ContractOpts) {
    return Erc20__factory.connect(address, this.networkProviderService.getProvider(network));
  }
  erc721({ address, network }: ContractOpts) {
    return Erc721__factory.connect(address, this.networkProviderService.getProvider(network));
  }
  multicall({ address, network }: ContractOpts) {
    return Multicall__factory.connect(address, this.networkProviderService.getProvider(network));
  }
}

export type { Erc1155 } from './ethers';
export type { Erc20 } from './ethers';
export type { Erc721 } from './ethers';
export type { Multicall } from './ethers';
