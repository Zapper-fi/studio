import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { DineroApxeth__factory, DineroPxeth__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class DineroViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  dineroApxeth({ address, network }: ContractOpts) {
    return DineroApxeth__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dineroPxeth({ address, network }: ContractOpts) {
    return DineroPxeth__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
