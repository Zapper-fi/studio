import { Inject, Injectable } from '@nestjs/common';

import { ContractFactory } from '~contract/contracts';
import { MulticallService } from '~multicall/multicall.service';
import { NetworkProviderService } from '~network-provider/network-provider.service';
import { DefaultDataProps } from '~position/display.interface';
import { AppGroupsDefinition, PositionService } from '~position/position.service';
import { TokenService } from '~token/token.service';
import { Network } from '~types/network.interface';

@Injectable()
export class AppToolkit {
  constructor(
    @Inject(ContractFactory) private readonly contractFactory: ContractFactory,
    @Inject(MulticallService) private readonly multicallService: MulticallService,
    @Inject(NetworkProviderService) private readonly networkProviderService: NetworkProviderService,
    @Inject(PositionService) private readonly positionService: PositionService,
    @Inject(TokenService) private readonly tokenService: TokenService,
  ) {}

  get globalContracts() {
    return this.contractFactory;
  }

  getNetworkProvider(network: Network) {
    return this.networkProviderService.getProvider(network);
  }

  getMulticall(network: Network) {
    return this.multicallService.getMulticall(network);
  }

  // Base Tokens

  getBaseTokenPrices(network: Network) {
    return this.tokenService.getTokenPrices(network);
  }

  getBaseTokenPrice(opts: { network: Network; address: string }) {
    return this.tokenService.getTokenPrice(opts);
  }

  // Positions

  getAppTokens<T = DefaultDataProps>(...appTokenDefinition: AppGroupsDefinition[]) {
    return this.positionService.getAppTokens<T>(...appTokenDefinition);
  }

  getAppContractPositions<T = DefaultDataProps>(...appTokenDefinition: AppGroupsDefinition[]) {
    return this.positionService.getAppContractPositions<T>(...appTokenDefinition);
  }
}
