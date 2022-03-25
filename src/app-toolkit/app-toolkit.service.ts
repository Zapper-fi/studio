import { Inject, Injectable } from '@nestjs/common';

import { ContractFactory } from '~contract/contracts';
import { MulticallService } from '~multicall/multicall.service';
import { NetworkProviderService } from '~network-provider/network-provider.service';
import { TokenService } from '~token/token.service';
import { Network } from '~types/network.interface';

@Injectable()
export class AppToolkit {
  constructor(
    @Inject(NetworkProviderService) private readonly networkProviderService: NetworkProviderService,
    @Inject(MulticallService) private readonly multicallService: MulticallService,
    @Inject(ContractFactory) private readonly contractFactory: ContractFactory,
    @Inject(TokenService) private readonly tokenService: TokenService,
  ) {}

  getNetworkProvider(network: Network) {
    return this.networkProviderService.getProvider(network);
  }

  getMulticall(network: Network) {
    return this.multicallService.getMulticall(network);
  }

  getBaseTokenPrices(network: Network) {
    return this.tokenService.getTokenPrices(network);
  }

  getBaseTokenPrice(opts: { network: Network; address: string }) {
    return this.tokenService.getTokenPrice(opts);
  }

  get globalContracts() {
    return this.contractFactory;
  }
}
