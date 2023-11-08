import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { UnipilotEthereumFactory__factory, UnipilotPolygonFactory__factory, UnipilotVault__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class UnipilotViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  unipilotEthereumFactory({ address, network }: ContractOpts) {
    return UnipilotEthereumFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  unipilotPolygonFactory({ address, network }: ContractOpts) {
    return UnipilotPolygonFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  unipilotVault({ address, network }: ContractOpts) {
    return UnipilotVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
