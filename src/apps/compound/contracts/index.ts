import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { CompoundCToken__factory } from './ethers';
import { CompoundComptroller__factory } from './ethers';
import { CompoundLens__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class CompoundContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  compoundCToken({ address, network }: ContractOpts) {
    return CompoundCToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  compoundComptroller({ address, network }: ContractOpts) {
    return CompoundComptroller__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  compoundLens({ address, network }: ContractOpts) {
    return CompoundLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { CompoundCToken } from './ethers';
export type { CompoundComptroller } from './ethers';
export type { CompoundLens } from './ethers';
