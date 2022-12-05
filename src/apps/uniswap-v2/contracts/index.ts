import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { UniswapFactory__factory } from './ethers';
import { UniswapPair__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class UniswapV2ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  uniswapFactory({ address, network }: ContractOpts) {
    return UniswapFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  uniswapPair({ address, network }: ContractOpts) {
    return UniswapPair__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { UniswapFactory } from './ethers';
export type { UniswapPair } from './ethers';
