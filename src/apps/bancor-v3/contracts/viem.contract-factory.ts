import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  BancorNetwork__factory,
  BntPool__factory,
  PoolCollection__factory,
  PoolToken__factory,
  StandardRewards__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class BancorV3ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  bancorNetwork({ address, network }: ContractOpts) {
    return BancorNetwork__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  bntPool({ address, network }: ContractOpts) {
    return BntPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolCollection({ address, network }: ContractOpts) {
    return PoolCollection__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolToken({ address, network }: ContractOpts) {
    return PoolToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  standardRewards({ address, network }: ContractOpts) {
    return StandardRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
