import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { LodestarComptroller__factory, LodestarIToken__factory, LodestarLens__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LodestarContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  lodestarComptroller({ address, network }: ContractOpts) {
    return LodestarComptroller__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lodestarIToken({ address, network }: ContractOpts) {
    return LodestarIToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lodestarLens({ address, network }: ContractOpts) {
    return LodestarLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { LodestarComptroller } from './ethers';
export type { LodestarIToken } from './ethers';
export type { LodestarLens } from './ethers';
