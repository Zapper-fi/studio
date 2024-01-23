import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { Series__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class OriginStoryViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  series({ address, network }: ContractOpts) {
    return Series__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
