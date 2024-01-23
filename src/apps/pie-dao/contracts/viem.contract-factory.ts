import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  PieDaoReferralRewards__factory,
  PieDaoRewards__factory,
  PieDaoStaking__factory,
  PieDaoVoteLockedDough__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PieDaoViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  pieDaoReferralRewards({ address, network }: ContractOpts) {
    return PieDaoReferralRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pieDaoRewards({ address, network }: ContractOpts) {
    return PieDaoRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pieDaoStaking({ address, network }: ContractOpts) {
    return PieDaoStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pieDaoVoteLockedDough({ address, network }: ContractOpts) {
    return PieDaoVoteLockedDough__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
