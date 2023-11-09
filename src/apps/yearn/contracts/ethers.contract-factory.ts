import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  YearnGovernance__factory,
  YearnStakedYCrv__factory,
  YearnStaking__factory,
  YearnStakingRewardRegistry__factory,
  YearnVeYfi__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class YearnContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  yearnGovernance({ address, network }: ContractOpts) {
    return YearnGovernance__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnStakedYCrv({ address, network }: ContractOpts) {
    return YearnStakedYCrv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnStaking({ address, network }: ContractOpts) {
    return YearnStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnStakingRewardRegistry({ address, network }: ContractOpts) {
    return YearnStakingRewardRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnVeYfi({ address, network }: ContractOpts) {
    return YearnVeYfi__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { YearnGovernance } from './ethers';
export type { YearnStakedYCrv } from './ethers';
export type { YearnStaking } from './ethers';
export type { YearnStakingRewardRegistry } from './ethers';
export type { YearnVeYfi } from './ethers';
