import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { MoonrockToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MoonrockViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  moonrockToken({ address, network }: ContractOpts) {
    return MoonrockToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
