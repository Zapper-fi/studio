import { Inject } from '@nestjs/common';

import { ContractFactory } from '~contract';
import { NetworkProviderService } from '~network-provider/network-provider.service';
import { Network } from '~types';

import { EthersMulticallDataLoader } from './impl/multicall.ethers';
import { MULTICALL_ADDRESSES } from './multicall.registry';
import { ContractViemContractFactory } from '~contract/contracts';
import { ViemMulticallDataLoader } from './impl/multicall.viem';

export class MulticallService {
  private readonly contractFactory: ContractFactory;
  private readonly viemContractFactory: ContractViemContractFactory;

  constructor(@Inject(NetworkProviderService) private readonly networkProviderService: NetworkProviderService) {
    this.contractFactory = new ContractFactory((network: Network) => this.networkProviderService.getProvider(network));
    this.viemContractFactory = new ContractViemContractFactory((network: Network) =>
      this.networkProviderService.getViemProvider(network),
    );
  }

  getMulticall(network: Network) {
    const multicallAddress = MULTICALL_ADDRESSES[network];
    if (!multicallAddress) throw new Error(`Multicall not supported on network "${network}"`);

    const contract = this.contractFactory.multicall({ network, address: multicallAddress });
    return new EthersMulticallDataLoader(contract);
  }

  getViemMulticall(network: Network) {
    const multicallAddress = MULTICALL_ADDRESSES[network];
    if (!multicallAddress) throw new Error(`Multicall not supported on network "${network}"`);

    const contract = this.viemContractFactory.multicall({ network, address: multicallAddress });
    return new ViemMulticallDataLoader(contract);
  }
}
