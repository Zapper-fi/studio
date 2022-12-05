import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { RookKToken__factory } from './ethers';
import { RookLiquidityPoolDistributor__factory } from './ethers';
import { RookLiquidityPoolV2__factory } from './ethers';
import { RookLiquidityPoolV3__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class RookContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  rookKToken({ address, network }: ContractOpts) {
    return RookKToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rookLiquidityPoolDistributor({ address, network }: ContractOpts) {
    return RookLiquidityPoolDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rookLiquidityPoolV2({ address, network }: ContractOpts) {
    return RookLiquidityPoolV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rookLiquidityPoolV3({ address, network }: ContractOpts) {
    return RookLiquidityPoolV3__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { RookKToken } from './ethers';
export type { RookLiquidityPoolDistributor } from './ethers';
export type { RookLiquidityPoolV2 } from './ethers';
export type { RookLiquidityPoolV3 } from './ethers';
