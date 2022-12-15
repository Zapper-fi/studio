import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AtlendisBorrowerPools__factory } from './ethers';
import { AtlendisPositionManager__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AtlendisV1ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  atlendisBorrowerPools({ address, network }: ContractOpts) {
    return AtlendisBorrowerPools__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  atlendisPositionManager({ address, network }: ContractOpts) {
    return AtlendisPositionManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AtlendisBorrowerPools } from './ethers';
export type { AtlendisPositionManager } from './ethers';
