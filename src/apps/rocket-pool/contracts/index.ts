import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { RocketDaoNodeTrusted__factory } from './ethers';
import { RocketMinipoolManager__factory } from './ethers';
import { RocketNodeStaking__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class RocketPoolContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  rocketDaoNodeTrusted({ address, network }: ContractOpts) {
    return RocketDaoNodeTrusted__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rocketMinipoolManager({ address, network }: ContractOpts) {
    return RocketMinipoolManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rocketNodeStaking({ address, network }: ContractOpts) {
    return RocketNodeStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { RocketDaoNodeTrusted } from './ethers';
export type { RocketMinipoolManager } from './ethers';
export type { RocketNodeStaking } from './ethers';
