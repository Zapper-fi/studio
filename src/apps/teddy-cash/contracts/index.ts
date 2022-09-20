import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { TeddyCashStabilityPool__factory } from './ethers';
import { TeddyCashStaking__factory } from './ethers';
import { TeddyCashTroveManager__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class TeddyCashContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  teddyCashStabilityPool({ address, network }: ContractOpts) {
    return TeddyCashStabilityPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  teddyCashStaking({ address, network }: ContractOpts) {
    return TeddyCashStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  teddyCashTroveManager({ address, network }: ContractOpts) {
    return TeddyCashTroveManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { TeddyCashStabilityPool } from './ethers';
export type { TeddyCashStaking } from './ethers';
export type { TeddyCashTroveManager } from './ethers';
