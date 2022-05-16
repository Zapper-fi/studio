import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { BntPool__factory } from './ethers';
import { PoolCollection__factory } from './ethers';
import { PoolToken__factory } from './ethers';
import { StandardRewards__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class BancorContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  bntPool({ address, network }: ContractOpts) {
    return BntPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolCollection({ address, network }: ContractOpts) {
    return PoolCollection__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolToken({ address, network }: ContractOpts) {
    return PoolToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  standardRewards({ address, network }: ContractOpts) {
    return StandardRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BntPool } from './ethers';
export type { PoolCollection } from './ethers';
export type { PoolToken } from './ethers';
export type { StandardRewards } from './ethers';
