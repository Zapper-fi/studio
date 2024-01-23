import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
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
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PancakeswapV3ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  pancakeswapFactory({ address, network }: ContractOpts) {
    return PancakeswapFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapInterfaceMulticall({ address, network }: ContractOpts) {
    return PancakeswapInterfaceMulticall__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapMasterchef({ address, network }: ContractOpts) {
    return PancakeswapMasterchef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapMigrator({ address, network }: ContractOpts) {
    return PancakeswapMigrator__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapNfPositionManager({ address, network }: ContractOpts) {
    return PancakeswapNfPositionManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapPool({ address, network }: ContractOpts) {
    return PancakeswapPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapPoolDeployer({ address, network }: ContractOpts) {
    return PancakeswapPoolDeployer__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapSmartRouter({ address, network }: ContractOpts) {
    return PancakeswapSmartRouter__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapSwapRouter({ address, network }: ContractOpts) {
    return PancakeswapSwapRouter__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapTickLens({ address, network }: ContractOpts) {
    return PancakeswapTickLens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapTokenValidator({ address, network }: ContractOpts) {
    return PancakeswapTokenValidator__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
