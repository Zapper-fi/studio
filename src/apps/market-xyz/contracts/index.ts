import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PoolDirectory__factory } from './ethers';
import { PoolLens__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MarketXyzContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  poolDirectory({ address, network }: ContractOpts) {
    return PoolDirectory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolLens({ address, network }: ContractOpts) {
    return PoolLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PoolDirectory } from './ethers';
export type { PoolLens } from './ethers';
