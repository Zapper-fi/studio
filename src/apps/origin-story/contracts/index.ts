import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { OriginStoryWoeth__factory, Series__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class OriginStoryContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  originStoryWoeth({ address, network }: ContractOpts) {
    return OriginStoryWoeth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  series({ address, network }: ContractOpts) {
    return Series__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { OriginStoryWoeth } from './ethers';
export type { Series } from './ethers';
