import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { StakefishFeePool__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class StakefishViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  stakefishFeePool({ address, network }: ContractOpts) {
    return StakefishFeePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
