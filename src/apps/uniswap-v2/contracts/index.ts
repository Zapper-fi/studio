import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { UniswapFactory__factory } from './ethers';
import { UniswapPair__factory } from './ethers';
import { UniswapV3Factory__factory } from './ethers';
import { UniswapV3Pool__factory } from './ethers';
import { UniswapV3PositionManager__factory } from './ethers';

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
  uniswapV3Factory({ address, network }: ContractOpts) {
    return UniswapV3Factory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  uniswapV3Pool({ address, network }: ContractOpts) {
    return UniswapV3Pool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  uniswapV3PositionManager({ address, network }: ContractOpts) {
    return UniswapV3PositionManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { UniswapFactory } from './ethers';
export type { UniswapPair } from './ethers';
export type { UniswapV3Factory } from './ethers';
export type { UniswapV3Pool } from './ethers';
export type { UniswapV3PositionManager } from './ethers';
