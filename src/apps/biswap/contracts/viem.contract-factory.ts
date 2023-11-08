import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { BiswapFactory__factory, BiswapMasterchef__factory, BiswapPool__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class BiswapViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  biswapFactory({ address, network }: ContractOpts) {
    return BiswapFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  biswapMasterchef({ address, network }: ContractOpts) {
    return BiswapMasterchef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  biswapPool({ address, network }: ContractOpts) {
    return BiswapPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
