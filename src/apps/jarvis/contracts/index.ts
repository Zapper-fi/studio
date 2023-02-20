import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  JarvisSynth__factory,
  JarvisSynthereumFinder__factory,
  JarvisSynthereumLiquidityPool__factory,
  JarvisSynthereumPriceFeed__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class JarvisContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  jarvisSynth({ address, network }: ContractOpts) {
    return JarvisSynth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  jarvisSynthereumFinder({ address, network }: ContractOpts) {
    return JarvisSynthereumFinder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  jarvisSynthereumLiquidityPool({ address, network }: ContractOpts) {
    return JarvisSynthereumLiquidityPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  jarvisSynthereumPriceFeed({ address, network }: ContractOpts) {
    return JarvisSynthereumPriceFeed__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { JarvisSynth } from './ethers';
export type { JarvisSynthereumFinder } from './ethers';
export type { JarvisSynthereumLiquidityPool } from './ethers';
export type { JarvisSynthereumPriceFeed } from './ethers';
