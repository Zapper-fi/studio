import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { StakingV2__factory, StakingV3__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AirswapViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  stakingV2({ address, network }: ContractOpts) {
    return StakingV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stakingV3({ address, network }: ContractOpts) {
    return StakingV3__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
