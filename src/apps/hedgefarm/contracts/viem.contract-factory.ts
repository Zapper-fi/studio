import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { AlphaOne__factory, AlphaTwo__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class HedgefarmViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  alphaOne({ address, network }: ContractOpts) {
    return AlphaOne__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  alphaTwo({ address, network }: ContractOpts) {
    return AlphaTwo__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
