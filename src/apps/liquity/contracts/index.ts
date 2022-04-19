import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { LiquityStaking__factory } from './ethers';
import { StabilityPool__factory } from './ethers';
import { TroveManager__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LiquityContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  liquityStaking({ address, network }: ContractOpts) {
    return LiquityStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stabilityPool({ address, network }: ContractOpts) {
    return StabilityPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  troveManager({ address, network }: ContractOpts) {
    return TroveManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { LiquityStaking } from './ethers';
export type { StabilityPool } from './ethers';
export type { TroveManager } from './ethers';
