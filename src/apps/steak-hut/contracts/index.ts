import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SteakHutEscrow__factory } from './ethers';
import { SteakHutPool__factory } from './ethers';
import { SteakHutStaking__factory } from './ethers';
import { SteakHutZapper__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SteakHutContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  steakHutEscrow({ address, network }: ContractOpts) {
    return SteakHutEscrow__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  steakHutPool({ address, network }: ContractOpts) {
    return SteakHutPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  steakHutStaking({ address, network }: ContractOpts) {
    return SteakHutStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  steakHutZapper({ address, network }: ContractOpts) {
    return SteakHutZapper__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SteakHutEscrow } from './ethers';
export type { SteakHutPool } from './ethers';
export type { SteakHutStaking } from './ethers';
export type { SteakHutZapper } from './ethers';
