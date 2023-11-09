import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { PStakePool__factory, PStakeStkToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PStakeViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  pStakePool({ address, network }: ContractOpts) {
    return PStakePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pStakeStkToken({ address, network }: ContractOpts) {
    return PStakeStkToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
