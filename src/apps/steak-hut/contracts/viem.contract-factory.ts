import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { SteakHutHjoe__factory, SteakHutPool__factory, SteakHutStaking__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SteakHutViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  steakHutHjoe({ address, network }: ContractOpts) {
    return SteakHutHjoe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  steakHutPool({ address, network }: ContractOpts) {
    return SteakHutPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  steakHutStaking({ address, network }: ContractOpts) {
    return SteakHutStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
