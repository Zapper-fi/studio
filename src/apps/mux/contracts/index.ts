import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MuxReader__factory } from './ethers';
import { MuxRewardRouter__factory } from './ethers';
import { MuxRewardTracker__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MuxContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  muxReader({ address, network }: ContractOpts) {
    return MuxReader__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  muxRewardRouter({ address, network }: ContractOpts) {
    return MuxRewardRouter__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  muxRewardTracker({ address, network }: ContractOpts) {
    return MuxRewardTracker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MuxReader } from './ethers';
export type { MuxRewardRouter } from './ethers';
export type { MuxRewardTracker } from './ethers';
