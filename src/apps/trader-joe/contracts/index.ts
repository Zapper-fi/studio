import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { TraderJoeChefBoosted__factory } from './ethers';
import { TraderJoeChefBoostedRewarder__factory } from './ethers';
import { TraderJoeChefV2__factory } from './ethers';
import { TraderJoeChefV2Rewarder__factory } from './ethers';
import { TraderJoeChefV3__factory } from './ethers';
import { TraderJoeChefV3Rewarder__factory } from './ethers';
import { TraderJoeStableStaking__factory } from './ethers';
import { TraderJoeVeJoeStaking__factory } from './ethers';
import { TraderJoeXJoe__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class TraderJoeContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  traderJoeChefBoosted({ address, network }: ContractOpts) {
    return TraderJoeChefBoosted__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  traderJoeChefBoostedRewarder({ address, network }: ContractOpts) {
    return TraderJoeChefBoostedRewarder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  traderJoeChefV2({ address, network }: ContractOpts) {
    return TraderJoeChefV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  traderJoeChefV2Rewarder({ address, network }: ContractOpts) {
    return TraderJoeChefV2Rewarder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  traderJoeChefV3({ address, network }: ContractOpts) {
    return TraderJoeChefV3__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  traderJoeChefV3Rewarder({ address, network }: ContractOpts) {
    return TraderJoeChefV3Rewarder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  traderJoeStableStaking({ address, network }: ContractOpts) {
    return TraderJoeStableStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  traderJoeVeJoeStaking({ address, network }: ContractOpts) {
    return TraderJoeVeJoeStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  traderJoeXJoe({ address, network }: ContractOpts) {
    return TraderJoeXJoe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { TraderJoeChefBoosted } from './ethers';
export type { TraderJoeChefBoostedRewarder } from './ethers';
export type { TraderJoeChefV2 } from './ethers';
export type { TraderJoeChefV2Rewarder } from './ethers';
export type { TraderJoeChefV3 } from './ethers';
export type { TraderJoeChefV3Rewarder } from './ethers';
export type { TraderJoeStableStaking } from './ethers';
export type { TraderJoeVeJoeStaking } from './ethers';
export type { TraderJoeXJoe } from './ethers';
