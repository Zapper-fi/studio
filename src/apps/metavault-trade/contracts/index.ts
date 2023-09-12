import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  MetavaultTradeMvlpManager__factory,
  MetavaultTradeRewardReader__factory,
  MetavaultTradeRewardTracker__factory,
  MetavaultTradeVault__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MetavaultTradeContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  metavaultTradeMvlpManager({ address, network }: ContractOpts) {
    return MetavaultTradeMvlpManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  metavaultTradeRewardReader({ address, network }: ContractOpts) {
    return MetavaultTradeRewardReader__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  metavaultTradeRewardTracker({ address, network }: ContractOpts) {
    return MetavaultTradeRewardTracker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  metavaultTradeVault({ address, network }: ContractOpts) {
    return MetavaultTradeVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MetavaultTradeMvlpManager } from './ethers';
export type { MetavaultTradeRewardReader } from './ethers';
export type { MetavaultTradeRewardTracker } from './ethers';
export type { MetavaultTradeVault } from './ethers';
