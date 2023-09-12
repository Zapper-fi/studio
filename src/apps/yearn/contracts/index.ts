import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  YearnGovernance__factory,
  YearnLpYCrv__factory,
  YearnStakedYCrv__factory,
  YearnStaking__factory,
  YearnStakingRewardRegistry__factory,
  YearnVault__factory,
  YearnVaultV2__factory,
  YearnVeYfi__factory,
  YearnYCrv__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class YearnContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  yearnGovernance({ address, network }: ContractOpts) {
    return YearnGovernance__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnLpYCrv({ address, network }: ContractOpts) {
    return YearnLpYCrv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
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
  yearnVault({ address, network }: ContractOpts) {
    return YearnVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnVaultV2({ address, network }: ContractOpts) {
    return YearnVaultV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnVeYfi({ address, network }: ContractOpts) {
    return YearnVeYfi__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnYCrv({ address, network }: ContractOpts) {
    return YearnYCrv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { YearnGovernance } from './ethers';
export type { YearnLpYCrv } from './ethers';
export type { YearnStakedYCrv } from './ethers';
export type { YearnStaking } from './ethers';
export type { YearnStakingRewardRegistry } from './ethers';
export type { YearnVault } from './ethers';
export type { YearnVaultV2 } from './ethers';
export type { YearnVeYfi } from './ethers';
export type { YearnYCrv } from './ethers';
