import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { StakingV2__factory } from './ethers';
import { StakingV3__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AirswapContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  stakingV2({ address, network }: ContractOpts) {
    return StakingV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stakingV3({ address, network }: ContractOpts) {
    return StakingV3__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { StakingV2 } from './ethers';
export type { StakingV3 } from './ethers';
