import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { ManagedIndex__factory } from './ethers';
import { VToken__factory } from './ethers';
import { VTokenFactory__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PhutureContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  managedIndex({ address, network }: ContractOpts) {
    return ManagedIndex__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vToken({ address, network }: ContractOpts) {
    return VToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vTokenFactory({ address, network }: ContractOpts) {
    return VTokenFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { ManagedIndex } from './ethers';
export type { VToken } from './ethers';
export type { VTokenFactory } from './ethers';
