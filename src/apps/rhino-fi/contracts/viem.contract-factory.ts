import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { RhinoFiBridge__factory, RhinoFiStarkEx__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RhinoFiViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  rhinoFiBridge({ address, network }: ContractOpts) {
    return RhinoFiBridge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rhinoFiStarkEx({ address, network }: ContractOpts) {
    return RhinoFiStarkEx__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
