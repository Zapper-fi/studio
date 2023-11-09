import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { MeshswapSinglePool__factory, MeshswapSinglePoolFactory__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MeshswapViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  meshswapSinglePool({ address, network }: ContractOpts) {
    return MeshswapSinglePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  meshswapSinglePoolFactory({ address, network }: ContractOpts) {
    return MeshswapSinglePoolFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
