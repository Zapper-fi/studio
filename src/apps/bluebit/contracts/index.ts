import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { BluebitChef__factory, BluebitVeToken__factory, Stats__factory, Vault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class BluebitContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  bluebitChef({ address, network }: ContractOpts) {
    return BluebitChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  bluebitVeToken({ address, network }: ContractOpts) {
    return BluebitVeToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stats({ address, network }: ContractOpts) {
    return Stats__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vault({ address, network }: ContractOpts) {
    return Vault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BluebitChef } from './ethers';
export type { BluebitVeToken } from './ethers';
export type { Stats } from './ethers';
export type { Vault } from './ethers';
