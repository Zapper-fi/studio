import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { ChronosFactory__factory, ChronosPool__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ChronosViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  chronosFactory({ address, network }: ContractOpts) {
    return ChronosFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  chronosPool({ address, network }: ContractOpts) {
    return ChronosPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
