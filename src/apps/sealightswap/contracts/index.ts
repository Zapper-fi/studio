import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SealightswapFactory__factory } from './ethers';
import { SealightswapPoolFactory__factory } from './ethers';
import { SealightswapToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SealightswapContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  sealightswapFactory({ address, network }: ContractOpts) {
    return SealightswapFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sealightswapPoolFactory({ address, network }: ContractOpts) {
    return SealightswapPoolFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sealightswapToken({ address, network }: ContractOpts) {
    return SealightswapToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SealightswapFactory } from './ethers';
export type { SealightswapPoolFactory } from './ethers';
export type { SealightswapToken } from './ethers';
