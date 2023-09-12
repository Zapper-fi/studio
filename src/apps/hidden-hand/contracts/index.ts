import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { HiddenHandHarvester__factory, HiddenHandRewardDistributor__factory } from './ethers';
// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class HiddenHandContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  hiddenHandRewardDistributor({ address, network }: ContractOpts) {
    return HiddenHandRewardDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }

  hiddenHandHarvester({ address, network }: ContractOpts) {
    return HiddenHandHarvester__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { HiddenHandRewardDistributor } from './ethers';
