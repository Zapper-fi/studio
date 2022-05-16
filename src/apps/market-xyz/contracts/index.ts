import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Comptroller__factory } from './ethers/index';
import { MarketLens__factory } from './ethers/index';
import { PoolDirectory__factory } from './ethers/index';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MarketXyzContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  comptroller({ address, network }: ContractOpts) {
    return Comptroller__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  marketLens({ address, network }: ContractOpts) {
    return MarketLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolDirectory({ address, network }: ContractOpts) {
    return PoolDirectory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Comptroller } from './ethers/index';
export type { MarketLens } from './ethers/index';
export type { PoolDirectory } from './ethers/index';
