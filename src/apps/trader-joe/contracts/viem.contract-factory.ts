import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  TraderJoeChefBoosted__factory,
  TraderJoeChefBoostedRewarder__factory,
  TraderJoeChefV2__factory,
  TraderJoeChefV2Rewarder__factory,
  TraderJoeChefV3__factory,
  TraderJoeChefV3Rewarder__factory,
  TraderJoeStableStaking__factory,
  TraderJoeVeJoe__factory,
  TraderJoeVeJoeStaking__factory,
  TraderJoeXJoe__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class TraderJoeViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  traderJoeChefBoosted({ address, network }: ContractOpts) {
    return TraderJoeChefBoosted__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  traderJoeChefBoostedRewarder({ address, network }: ContractOpts) {
    return TraderJoeChefBoostedRewarder__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  traderJoeChefV2({ address, network }: ContractOpts) {
    return TraderJoeChefV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  traderJoeChefV2Rewarder({ address, network }: ContractOpts) {
    return TraderJoeChefV2Rewarder__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  traderJoeChefV3({ address, network }: ContractOpts) {
    return TraderJoeChefV3__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  traderJoeChefV3Rewarder({ address, network }: ContractOpts) {
    return TraderJoeChefV3Rewarder__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  traderJoeStableStaking({ address, network }: ContractOpts) {
    return TraderJoeStableStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  traderJoeVeJoe({ address, network }: ContractOpts) {
    return TraderJoeVeJoe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  traderJoeVeJoeStaking({ address, network }: ContractOpts) {
    return TraderJoeVeJoeStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  traderJoeXJoe({ address, network }: ContractOpts) {
    return TraderJoeXJoe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
