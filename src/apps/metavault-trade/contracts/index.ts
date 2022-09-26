import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MvlpManager__factory } from './ethers';
import { RewardReader__factory } from './ethers';
import { RewardTracker__factory } from './ethers';
import { Vault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MetavaultTradeContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  mvlpManager({ address, network }: ContractOpts) {
    return MvlpManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rewardReader({ address, network }: ContractOpts) {
    return RewardReader__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rewardTracker({ address, network }: ContractOpts) {
    return RewardTracker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vault({ address, network }: ContractOpts) {
    return Vault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MvlpManager } from './ethers';
export type { RewardReader } from './ethers';
export type { RewardTracker } from './ethers';
export type { Vault } from './ethers';
