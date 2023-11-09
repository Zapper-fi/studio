import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { ApecoinStaking__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ApecoinViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  apecoinStaking({ address, network }: ContractOpts) {
    return ApecoinStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
