import { Inject, Injectable } from '@nestjs/common';

import { ContractFactory } from '~contract/contracts';
import { MulticallService } from '~multicall/multicall.service';
import { NetworkProviderService } from '~network-provider/network-provider.service';
import { Network } from '~types/network.interface';

@Injectable()
export class AppToolkit {
  constructor(
    @Inject(NetworkProviderService) private readonly networkProviderService: NetworkProviderService,
    @Inject(MulticallService) private readonly multicallService: MulticallService,
    @Inject(ContractFactory) private readonly contractFactory: ContractFactory,
  ) {}

  getNetworkProvider(network: Network) {
    return this.networkProviderService.getProvider(network);
  }

  getMulticall(network: Network) {
    return this.multicallService.getMulticall(network);
  }

  get globalContracts() {
    return this.contractFactory;
  }
}
