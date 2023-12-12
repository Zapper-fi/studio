import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  LooksRareCompounder__factory,
  LooksRareFeeSharing__factory,
  LooksRareStakingPool__factory,
  LooksRareStakingRewardsV2__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class LooksRareViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  looksRareCompounder({ address, network }: ContractOpts) {
    return LooksRareCompounder__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  looksRareFeeSharing({ address, network }: ContractOpts) {
    return LooksRareFeeSharing__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  looksRareStakingPool({ address, network }: ContractOpts) {
    return LooksRareStakingPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  looksRareStakingRewardsV2({ address, network }: ContractOpts) {
    return LooksRareStakingRewardsV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
