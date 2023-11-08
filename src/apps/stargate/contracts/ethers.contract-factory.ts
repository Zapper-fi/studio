import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  StargateChef__factory,
  StargateChefBase__factory,
  StargateEth__factory,
  StargateFactory__factory,
  StargatePool__factory,
  StargateVe__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class StargateContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  stargateChef({ address, network }: ContractOpts) {
    return StargateChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stargateChefBase({ address, network }: ContractOpts) {
    return StargateChefBase__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stargateEth({ address, network }: ContractOpts) {
    return StargateEth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stargateFactory({ address, network }: ContractOpts) {
    return StargateFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stargatePool({ address, network }: ContractOpts) {
    return StargatePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stargateVe({ address, network }: ContractOpts) {
    return StargateVe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { StargateChef } from './ethers';
export type { StargateChefBase } from './ethers';
export type { StargateEth } from './ethers';
export type { StargateFactory } from './ethers';
export type { StargatePool } from './ethers';
export type { StargateVe } from './ethers';
