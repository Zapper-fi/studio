import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { BeethovenXBeetsBar__factory } from './ethers';
import { BeethovenXMasterchef__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class BeethovenXContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  beethovenXBeetsBar({ address, network }: ContractOpts) {
    return BeethovenXBeetsBar__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  beethovenXMasterchef({ address, network }: ContractOpts) {
    return BeethovenXMasterchef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BeethovenXBeetsBar } from './ethers';
export type { BeethovenXMasterchef } from './ethers';
