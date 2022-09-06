import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { RookKToken__factory } from './ethers';
import { RookLiquidityPool__factory } from './ethers';
import { RookLiquidityPoolDistributor__factory } from './ethers';

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
  rookLiquidityPool({ address, network }: ContractOpts) {
    return RookLiquidityPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rookLiquidityPoolDistributor({ address, network }: ContractOpts) {
    return RookLiquidityPoolDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { RookKToken } from './ethers';
export type { RookLiquidityPool } from './ethers';
export type { RookLiquidityPoolDistributor } from './ethers';
