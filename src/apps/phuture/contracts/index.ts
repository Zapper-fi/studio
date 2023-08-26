import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PhutureManagedIndex__factory, PhutureVToken__factory, PhutureVTokenFactory__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PhutureContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  phutureManagedIndex({ address, network }: ContractOpts) {
    return PhutureManagedIndex__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  phutureVToken({ address, network }: ContractOpts) {
    return PhutureVToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  phutureVTokenFactory({ address, network }: ContractOpts) {
    return PhutureVTokenFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PhutureManagedIndex } from './ethers';
export type { PhutureVToken } from './ethers';
export type { PhutureVTokenFactory } from './ethers';
