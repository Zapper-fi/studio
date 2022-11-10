import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { UnipilotEthereumFactory__factory } from './ethers';
import { UnipilotPolygonFactory__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class UnipilotContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  unipilotEthereumFactory({ address, network }: ContractOpts) {
    return UnipilotEthereumFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  unipilotPolygonFactory({ address, network }: ContractOpts) {
    return UnipilotPolygonFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { UnipilotEthereumFactory } from './ethers';
export type { UnipilotPolygonFactory } from './ethers';
