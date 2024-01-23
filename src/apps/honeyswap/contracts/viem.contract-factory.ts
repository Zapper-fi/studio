import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { HoneyswapFactory__factory, HoneyswapPair__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class HoneyswapViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  honeyswapFactory({ address, network }: ContractOpts) {
    return HoneyswapFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  honeyswapPair({ address, network }: ContractOpts) {
    return HoneyswapPair__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
