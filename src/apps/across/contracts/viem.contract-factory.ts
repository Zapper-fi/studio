import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { AcrossStaking__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AcrossViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  acrossStaking({ address, network }: ContractOpts) {
    return AcrossStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
