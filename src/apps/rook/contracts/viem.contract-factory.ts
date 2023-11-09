import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  RookKToken__factory,
  RookLiquidityPoolDistributor__factory,
  RookLiquidityPoolV2__factory,
  RookLiquidityPoolV3__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RookViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  rookKToken({ address, network }: ContractOpts) {
    return RookKToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rookLiquidityPoolDistributor({ address, network }: ContractOpts) {
    return RookLiquidityPoolDistributor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rookLiquidityPoolV2({ address, network }: ContractOpts) {
    return RookLiquidityPoolV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rookLiquidityPoolV3({ address, network }: ContractOpts) {
    return RookLiquidityPoolV3__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
