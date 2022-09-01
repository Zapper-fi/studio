import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { RhinoFiBridge__factory } from './ethers';
import { RhinoFiStarkEx__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class RhinoFiContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  rhinoFiBridge({ address, network }: ContractOpts) {
    return RhinoFiBridge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rhinoFiStarkEx({ address, network }: ContractOpts) {
    return RhinoFiStarkEx__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { RhinoFiBridge } from './ethers';
export type { RhinoFiStarkEx } from './ethers';
