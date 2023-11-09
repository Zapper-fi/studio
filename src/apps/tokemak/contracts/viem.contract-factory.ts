import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  TokemakAccToke__factory,
  TokemakReactor__factory,
  TokemakRewards__factory,
  TokemakRewardsHash__factory,
  TokemakTokeStaking__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class TokemakViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  tokemakAccToke({ address, network }: ContractOpts) {
    return TokemakAccToke__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tokemakReactor({ address, network }: ContractOpts) {
    return TokemakReactor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tokemakRewards({ address, network }: ContractOpts) {
    return TokemakRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tokemakRewardsHash({ address, network }: ContractOpts) {
    return TokemakRewardsHash__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tokemakTokeStaking({ address, network }: ContractOpts) {
    return TokemakTokeStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
