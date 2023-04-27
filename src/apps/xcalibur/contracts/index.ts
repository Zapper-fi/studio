import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  UniswapPairV2__factory,
  XcaliburPool__factory,
  XcaliburRouter__factory,
  XcaliburSwapFactory__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class XcaliburContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  uniswapPairV2({ address, network }: ContractOpts) {
    return UniswapPairV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  xcaliburPool({ address, network }: ContractOpts) {
    return XcaliburPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  xcaliburRouter({ address, network }: ContractOpts) {
    return XcaliburRouter__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  xcaliburSwapFactory({ address, network }: ContractOpts) {
    return XcaliburSwapFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { UniswapPairV2 } from './ethers';
export type { XcaliburPool } from './ethers';
export type { XcaliburRouter } from './ethers';
export type { XcaliburSwapFactory } from './ethers';
