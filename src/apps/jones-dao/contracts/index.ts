import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  JonesMetavault__factory,
  JonesMillinerV2__factory,
  JonesStakingRewards__factory,
  JonesStakingRewardsFactory__factory,
  JonesStrategyToken__factory,
  JonesStrategyVault__factory,
  JonesVault__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class JonesDaoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  jonesMetavault({ address, network }: ContractOpts) {
    return JonesMetavault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  jonesMillinerV2({ address, network }: ContractOpts) {
    return JonesMillinerV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  jonesStakingRewards({ address, network }: ContractOpts) {
    return JonesStakingRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  jonesStakingRewardsFactory({ address, network }: ContractOpts) {
    return JonesStakingRewardsFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  jonesStrategyToken({ address, network }: ContractOpts) {
    return JonesStrategyToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  jonesStrategyVault({ address, network }: ContractOpts) {
    return JonesStrategyVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  jonesVault({ address, network }: ContractOpts) {
    return JonesVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { JonesMetavault } from './ethers';
export type { JonesMillinerV2 } from './ethers';
export type { JonesStakingRewards } from './ethers';
export type { JonesStakingRewardsFactory } from './ethers';
export type { JonesStrategyToken } from './ethers';
export type { JonesStrategyVault } from './ethers';
export type { JonesVault } from './ethers';
