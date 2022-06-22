import { Inject } from '@nestjs/common';

import { ContractFactory } from '~contract';
import { NetworkProviderService } from '~network-provider/network-provider.service';
import { Network } from '~types';

import EthersMulticall from './multicall.ethers';
import { MULTICALL_ADDRESSES } from './multicall.registry';

export class MulticallService {
  private readonly contractFactory: ContractFactory;

  constructor(@Inject(NetworkProviderService) private readonly networkProviderService: NetworkProviderService) {
    this.contractFactory = new ContractFactory((network: Network) => this.networkProviderService.getProvider(network));
  }

  getMulticall(network: Network) {
    const multicallAddress = MULTICALL_ADDRESSES[network];
    if (!multicallAddress) throw new Error(`Multicall not supported on network "${network}"`);

    const contract = this.contractFactory.multicall({ network, address: multicallAddress });
    return new EthersMulticall(contract);
  }
}
