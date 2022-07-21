import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { StargateEth__factory } from './ethers';
import { StargateFarm__factory } from './ethers';
import { StargatePool__factory } from './ethers';
import { StargateVe__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class StargateFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  stargateEth({ address, network }: ContractOpts) {
    return StargateEth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stargateFarm({ address, network }: ContractOpts) {
    return StargateFarm__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stargatePool({ address, network }: ContractOpts) {
    return StargatePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stargateVe({ address, network }: ContractOpts) {
    return StargateVe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { StargateEth } from './ethers';
export type { StargateFarm } from './ethers';
export type { StargatePool } from './ethers';
export type { StargateVe } from './ethers';
