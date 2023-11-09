import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  MuxPool__factory,
  MuxReader__factory,
  MuxRewardRouter__factory,
  MuxRewardTracker__factory,
  MuxVault__factory,
  MuxVeMux__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MuxContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  muxPool({ address, network }: ContractOpts) {
    return MuxPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
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
  muxVault({ address, network }: ContractOpts) {
    return MuxVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  muxVeMux({ address, network }: ContractOpts) {
    return MuxVeMux__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MuxPool } from './ethers';
export type { MuxReader } from './ethers';
export type { MuxRewardRouter } from './ethers';
export type { MuxRewardTracker } from './ethers';
export type { MuxVault } from './ethers';
export type { MuxVeMux } from './ethers';
