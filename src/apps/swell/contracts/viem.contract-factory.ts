import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { Sweth__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SwellViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  sweth({ address, network }: ContractOpts) {
    return Sweth__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
