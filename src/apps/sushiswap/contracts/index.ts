import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SushiSwapChef__factory } from './ethers';
import { SushiSwapChefV2__factory } from './ethers';
import { SushiSwapMiniChef__factory } from './ethers';
import { SushiSwapRewarder__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SushiswapContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  sushiSwapChef({ address, network }: ContractOpts) {
    return SushiSwapChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sushiSwapChefV2({ address, network }: ContractOpts) {
    return SushiSwapChefV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sushiSwapMiniChef({ address, network }: ContractOpts) {
    return SushiSwapMiniChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sushiSwapRewarder({ address, network }: ContractOpts) {
    return SushiSwapRewarder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SushiSwapChef } from './ethers';
export type { SushiSwapChefV2 } from './ethers';
export type { SushiSwapMiniChef } from './ethers';
export type { SushiSwapRewarder } from './ethers';
