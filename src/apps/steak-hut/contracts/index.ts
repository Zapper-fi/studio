import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SteakHutHjoe__factory } from './ethers';
import { SteakHutPool__factory } from './ethers';
import { SteakHutStaking__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SteakHutContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  steakHutHjoe({ address, network }: ContractOpts) {
    return SteakHutHjoe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  steakHutPool({ address, network }: ContractOpts) {
    return SteakHutPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  steakHutStaking({ address, network }: ContractOpts) {
    return SteakHutStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SteakHutHjoe } from './ethers';
export type { SteakHutPool } from './ethers';
export type { SteakHutStaking } from './ethers';
