import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PoolTogetherV5VaultFactory__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PoolTogetherV5ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  poolTogetherV5VaultFactory({ address, network }: ContractOpts) {
    return PoolTogetherV5VaultFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PoolTogetherV5VaultFactory } from './ethers';
