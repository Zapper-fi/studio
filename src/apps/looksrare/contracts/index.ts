import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Aggregator__factory } from './ethers';
import { Feesharing__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LooksrareContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  aggregator({ address, network }: ContractOpts) {
    return Aggregator__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  feesharing({ address, network }: ContractOpts) {
    return Feesharing__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Aggregator } from './ethers';
export type { Feesharing } from './ethers';
