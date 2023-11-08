import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { LiquityStaking__factory, StabilityPool__factory, TroveManager__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class LiquityViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  liquityStaking({ address, network }: ContractOpts) {
    return LiquityStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stabilityPool({ address, network }: ContractOpts) {
    return StabilityPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  troveManager({ address, network }: ContractOpts) {
    return TroveManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
