import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Dsfort__factory, Fort__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class FortaContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  dsfort({ address, network }: ContractOpts) {
    return Dsfort__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  fort({ address, network }: ContractOpts) {
    return Fort__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Dsfort } from './ethers';
export type { Fort } from './ethers';
