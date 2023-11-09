import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  JarvisSynth__factory,
  JarvisSynthereumFinder__factory,
  JarvisSynthereumLiquidityPool__factory,
  JarvisSynthereumPriceFeed__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class JarvisViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  jarvisSynth({ address, network }: ContractOpts) {
    return JarvisSynth__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  jarvisSynthereumFinder({ address, network }: ContractOpts) {
    return JarvisSynthereumFinder__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  jarvisSynthereumLiquidityPool({ address, network }: ContractOpts) {
    return JarvisSynthereumLiquidityPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  jarvisSynthereumPriceFeed({ address, network }: ContractOpts) {
    return JarvisSynthereumPriceFeed__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
