import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { ContractFactory } from '~contract';
import { EthersMulticall, MULTICALL_ADDRESSES } from '~multicall';
import { NetworkProviderService } from '~network-provider/network-provider.service';
import { DefaultDataProps } from '~position/display.interface';
import { AppGroupsDefinition, PositionService } from '~position/position.service';
import { TokenService } from '~token/token.service';
import { Network } from '~types/network.interface';

import { AppToolkitHelperRegistry } from './app-toolkit.helpers';
import { IAppToolkit } from './app-toolkit.interface';

@Injectable()
export class AppToolkit implements IAppToolkit {
  private readonly contractFactory: ContractFactory;
  constructor(
    // We need the forward ref here, since there is a circular dependency on the AppToolkit, since each helper needs the toolkit
    @Inject(forwardRef(() => AppToolkitHelperRegistry)) private readonly helperRegistry: AppToolkitHelperRegistry,
    @Inject(NetworkProviderService) private readonly networkProviderService: NetworkProviderService,
    @Inject(PositionService) private readonly positionService: PositionService,
    @Inject(TokenService) private readonly tokenService: TokenService,
  ) {
    this.contractFactory = new ContractFactory((network: Network) => this.networkProviderService.getProvider(network));
  }

  get globalContracts() {
    return this.contractFactory;
  }

  get helpers() {
    return this.helperRegistry;
  }

  getNetworkProvider(network: Network) {
    return this.networkProviderService.getProvider(network);
  }

  getMulticall(network: Network) {
    const multicallAddress = MULTICALL_ADDRESSES[network];
    if (!multicallAddress) throw new Error(`Multicall not supported on network "${network}"`);

    const contract = this.contractFactory.multicall({
      network,
      address: multicallAddress,
    });

    return new EthersMulticall(contract);
  }

  // Base Tokens

  getBaseTokenPrices(network: Network) {
    return this.tokenService.getTokenPrices(network);
  }

  getBaseTokenPrice(opts: { network: Network; address: string }) {
    return this.tokenService.getTokenPrice(opts);
  }

  // Positions
  getAppTokenPositions<T = DefaultDataProps>(...appTokenDefinition: AppGroupsDefinition[]) {
    return this.positionService.getAppTokenPositions<T>(...appTokenDefinition);
  }

  getAppContractPositions<T = DefaultDataProps>(...appTokenDefinition: AppGroupsDefinition[]) {
    return this.positionService.getAppContractPositions<T>(...appTokenDefinition);
  }
}
