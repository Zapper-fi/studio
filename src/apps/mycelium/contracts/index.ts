import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MyceliumAumManager__factory } from './ethers';
import { MyceliumPositionReader__factory } from './ethers';
import { MyceliumRewardReader__factory } from './ethers';
import { MyceliumRewardTracker__factory } from './ethers';
import { MyceliumVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MyceliumContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  myceliumAumManager({ address, network }: ContractOpts) {
    return MyceliumAumManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  myceliumPositionReader({ address, network }: ContractOpts) {
    return MyceliumPositionReader__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  myceliumRewardReader({ address, network }: ContractOpts) {
    return MyceliumRewardReader__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  myceliumRewardTracker({ address, network }: ContractOpts) {
    return MyceliumRewardTracker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  myceliumVault({ address, network }: ContractOpts) {
    return MyceliumVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MyceliumAumManager } from './ethers';
export type { MyceliumPositionReader } from './ethers';
export type { MyceliumRewardReader } from './ethers';
export type { MyceliumRewardTracker } from './ethers';
export type { MyceliumVault } from './ethers';
