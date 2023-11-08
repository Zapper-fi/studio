import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { HalofiAbi__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class HalofiViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  halofiAbi({ address, network }: ContractOpts) {
    return HalofiAbi__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
