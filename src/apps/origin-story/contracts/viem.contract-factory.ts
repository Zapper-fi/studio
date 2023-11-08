import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { OriginStoryWoeth__factory, Series__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class OriginStoryViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  originStoryWoeth({ address, network }: ContractOpts) {
    return OriginStoryWoeth__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  series({ address, network }: ContractOpts) {
    return Series__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
