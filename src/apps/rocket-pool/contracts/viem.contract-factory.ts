import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  RocketDaoNodeTrusted__factory,
  RocketMinipool__factory,
  RocketMinipoolManager__factory,
  RocketNodeDeposit__factory,
  RocketNodeStaking__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RocketPoolViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  rocketDaoNodeTrusted({ address, network }: ContractOpts) {
    return RocketDaoNodeTrusted__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rocketMinipool({ address, network }: ContractOpts) {
    return RocketMinipool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rocketMinipoolManager({ address, network }: ContractOpts) {
    return RocketMinipoolManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rocketNodeDeposit({ address, network }: ContractOpts) {
    return RocketNodeDeposit__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rocketNodeStaking({ address, network }: ContractOpts) {
    return RocketNodeStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
