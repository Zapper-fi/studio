import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { GmxAumManager__factory } from './ethers';
import { GmxRewardReader__factory } from './ethers';
import { GmxRewardTracker__factory } from './ethers';
import { GmxVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class GmxContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  gmxAumManager({ address, network }: ContractOpts) {
    return GmxAumManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  gmxRewardReader({ address, network }: ContractOpts) {
    return GmxRewardReader__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  gmxRewardTracker({ address, network }: ContractOpts) {
    return GmxRewardTracker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  gmxVault({ address, network }: ContractOpts) {
    return GmxVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { GmxAumManager } from './ethers';
export type { GmxRewardReader } from './ethers';
export type { GmxRewardTracker } from './ethers';
export type { GmxVault } from './ethers';
