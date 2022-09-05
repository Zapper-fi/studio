import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MorphoCToken__factory } from './ethers';
import { MorphoCompound__factory } from './ethers';
import { MorphoCompoundLens__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MorphoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  morphoCToken({ address, network }: ContractOpts) {
    return MorphoCToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  morphoCompound({ address, network }: ContractOpts) {
    return MorphoCompound__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  morphoCompoundLens({ address, network }: ContractOpts) {
    return MorphoCompoundLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MorphoCToken } from './ethers';
export type { MorphoCompound } from './ethers';
export type { MorphoCompoundLens } from './ethers';
