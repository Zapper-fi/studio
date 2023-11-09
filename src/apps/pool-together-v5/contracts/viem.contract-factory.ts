import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherV5VaultFactory__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PoolTogetherV5ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  poolTogetherV5VaultFactory({ address, network }: ContractOpts) {
    return PoolTogetherV5VaultFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
