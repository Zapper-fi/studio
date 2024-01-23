import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { UniswapFactory__factory, UniswapPair__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class UniswapV2ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  uniswapFactory({ address, network }: ContractOpts) {
    return UniswapFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  uniswapPair({ address, network }: ContractOpts) {
    return UniswapPair__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
