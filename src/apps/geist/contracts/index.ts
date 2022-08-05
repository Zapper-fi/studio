import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { GeistRewards__factory } from './ethers';
import { GeistStaking__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class GeistContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  geistRewards({ address, network }: ContractOpts) {
    return GeistRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  geistStaking({ address, network }: ContractOpts) {
    return GeistStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { GeistRewards } from './ethers';
export type { GeistStaking } from './ethers';
