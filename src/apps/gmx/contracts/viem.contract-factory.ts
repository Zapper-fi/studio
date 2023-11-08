import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { GmxAumManager__factory, GmxRewardReader__factory, GmxRewardTracker__factory, GmxVault__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class GmxViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  gmxAumManager({ address, network }: ContractOpts) {
    return GmxAumManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  gmxRewardReader({ address, network }: ContractOpts) {
    return GmxRewardReader__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  gmxRewardTracker({ address, network }: ContractOpts) {
    return GmxRewardTracker__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  gmxVault({ address, network }: ContractOpts) {
    return GmxVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
