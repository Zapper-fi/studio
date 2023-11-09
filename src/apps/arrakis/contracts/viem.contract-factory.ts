import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { ArrakisGelatoPool__factory, ArrakisPool__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ArrakisViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  arrakisGelatoPool({ address, network }: ContractOpts) {
    return ArrakisGelatoPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  arrakisPool({ address, network }: ContractOpts) {
    return ArrakisPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
