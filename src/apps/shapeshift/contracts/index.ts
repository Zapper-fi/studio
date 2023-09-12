import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { ShapeshiftStakingRewards__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ShapeshiftContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  shapeshiftStakingRewards({ address, network }: ContractOpts) {
    return ShapeshiftStakingRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { ShapeshiftStakingRewards } from './ethers';
