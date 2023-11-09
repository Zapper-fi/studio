import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  TokemakAccToke__factory,
  TokemakReactor__factory,
  TokemakRewards__factory,
  TokemakRewardsHash__factory,
  TokemakTokeStaking__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class TokemakContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  tokemakAccToke({ address, network }: ContractOpts) {
    return TokemakAccToke__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tokemakReactor({ address, network }: ContractOpts) {
    return TokemakReactor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tokemakRewards({ address, network }: ContractOpts) {
    return TokemakRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tokemakRewardsHash({ address, network }: ContractOpts) {
    return TokemakRewardsHash__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tokemakTokeStaking({ address, network }: ContractOpts) {
    return TokemakTokeStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { TokemakAccToke } from './ethers';
export type { TokemakReactor } from './ethers';
export type { TokemakRewards } from './ethers';
export type { TokemakRewardsHash } from './ethers';
export type { TokemakTokeStaking } from './ethers';
