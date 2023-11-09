import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  MetavaultTradeMvlpManager__factory,
  MetavaultTradeRewardReader__factory,
  MetavaultTradeRewardTracker__factory,
  MetavaultTradeVault__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MetavaultTradeViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  metavaultTradeMvlpManager({ address, network }: ContractOpts) {
    return MetavaultTradeMvlpManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  metavaultTradeRewardReader({ address, network }: ContractOpts) {
    return MetavaultTradeRewardReader__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  metavaultTradeRewardTracker({ address, network }: ContractOpts) {
    return MetavaultTradeRewardTracker__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  metavaultTradeVault({ address, network }: ContractOpts) {
    return MetavaultTradeVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
