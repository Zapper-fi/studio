import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { JonesMillinerV2__factory } from './ethers';
import { JonesStakingRewards__factory } from './ethers';
import { JonesStakingRewardsFactory__factory } from './ethers';
import { JonesVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class JonesDaoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
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
  jonesVault({ address, network }: ContractOpts) {
    return JonesVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { JonesMillinerV2 } from './ethers';
export type { JonesStakingRewards } from './ethers';
export type { JonesStakingRewardsFactory } from './ethers';
export type { JonesVault } from './ethers';
