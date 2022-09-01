import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { CompoundCToken__factory } from './ethers';
import { CompoundComptroller__factory } from './ethers';
import { MorphoCompoundLens__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MorphoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  compoundCToken({ address, network }: ContractOpts) {
    return CompoundCToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  compoundComptroller({ address, network }: ContractOpts) {
    return CompoundComptroller__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  morphoCompoundLens({ address, network }: ContractOpts) {
    return MorphoCompoundLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { CompoundCToken } from './ethers';
export type { CompoundComptroller } from './ethers';
export type { MorphoCompoundLens } from './ethers';
