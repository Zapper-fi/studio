import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { UniswapV3Factory__factory, UniswapV3Pool__factory, UniswapV3PositionManager__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class UniswapV3ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  uniswapV3Factory({ address, network }: ContractOpts) {
    return UniswapV3Factory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  uniswapV3Pool({ address, network }: ContractOpts) {
    return UniswapV3Pool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  uniswapV3PositionManager({ address, network }: ContractOpts) {
    return UniswapV3PositionManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
