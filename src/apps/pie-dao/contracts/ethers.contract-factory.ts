import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  PieDaoReferralRewards__factory,
  PieDaoRewards__factory,
  PieDaoStaking__factory,
  PieDaoVoteLockedDough__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PieDaoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  pieDaoReferralRewards({ address, network }: ContractOpts) {
    return PieDaoReferralRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pieDaoRewards({ address, network }: ContractOpts) {
    return PieDaoRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pieDaoStaking({ address, network }: ContractOpts) {
    return PieDaoStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pieDaoVoteLockedDough({ address, network }: ContractOpts) {
    return PieDaoVoteLockedDough__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PieDaoReferralRewards } from './ethers';
export type { PieDaoRewards } from './ethers';
export type { PieDaoStaking } from './ethers';
export type { PieDaoVoteLockedDough } from './ethers';
