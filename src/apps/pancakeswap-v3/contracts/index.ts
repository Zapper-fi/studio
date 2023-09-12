import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  PancakeswapFactory__factory,
  PancakeswapInterfaceMulticall__factory,
  PancakeswapMasterchef__factory,
  PancakeswapMigrator__factory,
  PancakeswapNfPositionManager__factory,
  PancakeswapPool__factory,
  PancakeswapPoolDeployer__factory,
  PancakeswapSmartRouter__factory,
  PancakeswapSwapRouter__factory,
  PancakeswapTickLens__factory,
  PancakeswapTokenValidator__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PancakeswapV3ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  pancakeswapFactory({ address, network }: ContractOpts) {
    return PancakeswapFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapInterfaceMulticall({ address, network }: ContractOpts) {
    return PancakeswapInterfaceMulticall__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapMasterchef({ address, network }: ContractOpts) {
    return PancakeswapMasterchef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapMigrator({ address, network }: ContractOpts) {
    return PancakeswapMigrator__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapNfPositionManager({ address, network }: ContractOpts) {
    return PancakeswapNfPositionManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapPool({ address, network }: ContractOpts) {
    return PancakeswapPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapPoolDeployer({ address, network }: ContractOpts) {
    return PancakeswapPoolDeployer__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapSmartRouter({ address, network }: ContractOpts) {
    return PancakeswapSmartRouter__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapSwapRouter({ address, network }: ContractOpts) {
    return PancakeswapSwapRouter__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapTickLens({ address, network }: ContractOpts) {
    return PancakeswapTickLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pancakeswapTokenValidator({ address, network }: ContractOpts) {
    return PancakeswapTokenValidator__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PancakeswapFactory } from './ethers';
export type { PancakeswapInterfaceMulticall } from './ethers';
export type { PancakeswapMasterchef } from './ethers';
export type { PancakeswapMigrator } from './ethers';
export type { PancakeswapNfPositionManager } from './ethers';
export type { PancakeswapPool } from './ethers';
export type { PancakeswapPoolDeployer } from './ethers';
export type { PancakeswapSmartRouter } from './ethers';
export type { PancakeswapSwapRouter } from './ethers';
export type { PancakeswapTickLens } from './ethers';
export type { PancakeswapTokenValidator } from './ethers';
