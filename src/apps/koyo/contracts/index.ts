import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { KoyoPool__factory } from './ethers';
import { KoyoVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class KoyoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  koyoPool({ address, network }: ContractOpts) {
    return KoyoPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  koyoVault({ address, network }: ContractOpts) {
    return KoyoVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { KoyoPool } from './ethers';
export type { KoyoVault } from './ethers';
