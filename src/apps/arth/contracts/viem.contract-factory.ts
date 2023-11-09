import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { StabilityPool__factory, TroveManager__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ArthViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  stabilityPool({ address, network }: ContractOpts) {
    return StabilityPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  troveManager({ address, network }: ContractOpts) {
    return TroveManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
