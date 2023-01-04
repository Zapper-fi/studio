import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  InverseController__factory,
  InverseDcaVaultToken__factory,
  InverseLendingPool__factory,
  InverseLens__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class InverseContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  inverseController({ address, network }: ContractOpts) {
    return InverseController__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  inverseDcaVaultToken({ address, network }: ContractOpts) {
    return InverseDcaVaultToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  inverseLendingPool({ address, network }: ContractOpts) {
    return InverseLendingPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  inverseLens({ address, network }: ContractOpts) {
    return InverseLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { InverseController } from './ethers';
export type { InverseDcaVaultToken } from './ethers';
export type { InverseLendingPool } from './ethers';
export type { InverseLens } from './ethers';
