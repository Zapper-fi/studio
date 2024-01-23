import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { GeistRewards__factory, GeistStaking__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class GeistViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  geistRewards({ address, network }: ContractOpts) {
    return GeistRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  geistStaking({ address, network }: ContractOpts) {
    return GeistStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
