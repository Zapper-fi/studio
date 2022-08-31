import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { TectonicCore__factory } from './ethers';
import { TectonicLens__factory } from './ethers';
import { TectonicStakingPool__factory } from './ethers';
import { TectonicTToken__factory } from './ethers';
import { TectonicXtonic__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class TectonicContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  tectonicCore({ address, network }: ContractOpts) {
    return TectonicCore__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tectonicLens({ address, network }: ContractOpts) {
    return TectonicLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tectonicStakingPool({ address, network }: ContractOpts) {
    return TectonicStakingPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tectonicTToken({ address, network }: ContractOpts) {
    return TectonicTToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tectonicXtonic({ address, network }: ContractOpts) {
    return TectonicXtonic__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { TectonicCore } from './ethers';
export type { TectonicLens } from './ethers';
export type { TectonicStakingPool } from './ethers';
export type { TectonicTToken } from './ethers';
export type { TectonicXtonic } from './ethers';
