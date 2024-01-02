import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { MstableStaking__factory, MstableStakingV2__factory, MstableVmta__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MstableViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  mstableStaking({ address, network }: ContractOpts) {
    return MstableStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  mstableStakingV2({ address, network }: ContractOpts) {
    return MstableStakingV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  mstableVmta({ address, network }: ContractOpts) {
    return MstableVmta__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
