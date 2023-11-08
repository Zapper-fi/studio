import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  MyceliumAumManager__factory,
  MyceliumMlpManager__factory,
  MyceliumPerpFarm__factory,
  MyceliumPerpToken__factory,
  MyceliumPositionReader__factory,
  MyceliumRewardReader__factory,
  MyceliumRewardTracker__factory,
  MyceliumStaking__factory,
  MyceliumVault__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MyceliumViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  myceliumAumManager({ address, network }: ContractOpts) {
    return MyceliumAumManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  myceliumMlpManager({ address, network }: ContractOpts) {
    return MyceliumMlpManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  myceliumPerpFarm({ address, network }: ContractOpts) {
    return MyceliumPerpFarm__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  myceliumPerpToken({ address, network }: ContractOpts) {
    return MyceliumPerpToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  myceliumPositionReader({ address, network }: ContractOpts) {
    return MyceliumPositionReader__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  myceliumRewardReader({ address, network }: ContractOpts) {
    return MyceliumRewardReader__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  myceliumRewardTracker({ address, network }: ContractOpts) {
    return MyceliumRewardTracker__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  myceliumStaking({ address, network }: ContractOpts) {
    return MyceliumStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  myceliumVault({ address, network }: ContractOpts) {
    return MyceliumVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
