import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { HoneyswapFactory__factory } from './ethers';
import { HoneyswapPair__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class HoneyswapContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  honeyswapFactory({ address, network }: ContractOpts) {
    return HoneyswapFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  honeyswapPair({ address, network }: ContractOpts) {
    return HoneyswapPair__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { HoneyswapFactory } from './ethers';
export type { HoneyswapPair } from './ethers';
