import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SpoolStaking__factory } from './ethers';
import { SpoolVault__factory } from './ethers';
import { SpoolVospool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SpoolContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  spoolStaking({ address, network }: ContractOpts) {
    return SpoolStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  spoolVault({ address, network }: ContractOpts) {
    return SpoolVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  spoolVospool({ address, network }: ContractOpts) {
    return SpoolVospool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SpoolStaking } from './ethers';
export type { SpoolVault } from './ethers';
export type { SpoolVospool } from './ethers';
