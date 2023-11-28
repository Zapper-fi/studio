import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  YearnGovernance__factory,
  YearnStakedYCrv__factory,
  YearnStaking__factory,
  YearnStakingReward__factory,
  YearnStakingRewardRegistry__factory,
  YearnVeYfi__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class YearnViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  yearnGovernance({ address, network }: ContractOpts) {
    return YearnGovernance__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  yearnStakedYCrv({ address, network }: ContractOpts) {
    return YearnStakedYCrv__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  yearnStaking({ address, network }: ContractOpts) {
    return YearnStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  yearnStakingReward({ address, network }: ContractOpts) {
    return YearnStakingReward__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  yearnStakingRewardRegistry({ address, network }: ContractOpts) {
    return YearnStakingRewardRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  yearnVeYfi({ address, network }: ContractOpts) {
    return YearnVeYfi__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
