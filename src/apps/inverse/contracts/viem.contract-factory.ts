import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  InverseController__factory,
  InverseDcaVaultToken__factory,
  InverseLendingPool__factory,
  InverseLens__factory,
  InverseStaking__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class InverseViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  inverseController({ address, network }: ContractOpts) {
    return InverseController__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  inverseDcaVaultToken({ address, network }: ContractOpts) {
    return InverseDcaVaultToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  inverseLendingPool({ address, network }: ContractOpts) {
    return InverseLendingPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  inverseLens({ address, network }: ContractOpts) {
    return InverseLens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  inverseStaking({ address, network }: ContractOpts) {
    return InverseStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
