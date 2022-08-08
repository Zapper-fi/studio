import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MeshswapSinglePool__factory } from './ethers';
import { MeshswapSinglePoolFactory__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MeshswapContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  meshswapSinglePool({ address, network }: ContractOpts) {
    return MeshswapSinglePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  meshswapSinglePoolFactory({ address, network }: ContractOpts) {
    return MeshswapSinglePoolFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MeshswapSinglePool } from './ethers';
export type { MeshswapSinglePoolFactory } from './ethers';
