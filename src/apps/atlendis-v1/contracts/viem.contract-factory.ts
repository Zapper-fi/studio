import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { AtlendisBorrowerPools__factory, AtlendisPositionManager__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AtlendisV1ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  atlendisBorrowerPools({ address, network }: ContractOpts) {
    return AtlendisBorrowerPools__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  atlendisPositionManager({ address, network }: ContractOpts) {
    return AtlendisPositionManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
