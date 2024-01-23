import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { HiddenHandHarvester__factory, HiddenHandRewardDistributor__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class HiddenHandViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  hiddenHandHarvester({ address, network }: ContractOpts) {
    return HiddenHandHarvester__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  hiddenHandRewardDistributor({ address, network }: ContractOpts) {
    return HiddenHandRewardDistributor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
