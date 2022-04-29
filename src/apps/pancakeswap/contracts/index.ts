import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PancakeswapCakeChef__factory } from './ethers';
import { PancakeswapChef__factory } from './ethers';
import { PancakeswapIfoChef__factory } from './ethers';
import { PancakeswapPair__factory } from './ethers';
import { PancakeswapSmartChef__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PancakeswapContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  pancakeswapCakeChef({ address, network }: ContractOpts) {
    return PancakeswapCakeChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapChef({ address, network }: ContractOpts) {
    return PancakeswapChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapIfoChef({ address, network }: ContractOpts) {
    return PancakeswapIfoChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapPair({ address, network }: ContractOpts) {
    return PancakeswapPair__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapSmartChef({ address, network }: ContractOpts) {
    return PancakeswapSmartChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PancakeswapCakeChef } from './ethers';
export type { PancakeswapChef } from './ethers';
export type { PancakeswapIfoChef } from './ethers';
export type { PancakeswapPair } from './ethers';
export type { PancakeswapSmartChef } from './ethers';
