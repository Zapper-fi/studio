import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { ReaperCrypt__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ReaperViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  reaperCrypt({ address, network }: ContractOpts) {
    return ReaperCrypt__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
