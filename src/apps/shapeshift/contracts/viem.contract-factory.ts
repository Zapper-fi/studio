import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { ShapeshiftStakingRewards__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ShapeshiftViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  shapeshiftStakingRewards({ address, network }: ContractOpts) {
    return ShapeshiftStakingRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
