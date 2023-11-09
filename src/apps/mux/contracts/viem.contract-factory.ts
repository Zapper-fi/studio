import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  MuxPool__factory,
  MuxReader__factory,
  MuxRewardRouter__factory,
  MuxRewardTracker__factory,
  MuxVault__factory,
  MuxVeMux__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MuxViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  muxPool({ address, network }: ContractOpts) {
    return MuxPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  muxReader({ address, network }: ContractOpts) {
    return MuxReader__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  muxRewardRouter({ address, network }: ContractOpts) {
    return MuxRewardRouter__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  muxRewardTracker({ address, network }: ContractOpts) {
    return MuxRewardTracker__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  muxVault({ address, network }: ContractOpts) {
    return MuxVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  muxVeMux({ address, network }: ContractOpts) {
    return MuxVeMux__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
