import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { SymphonyYolo__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SymphonyViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  symphonyYolo({ address, network }: ContractOpts) {
    return SymphonyYolo__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
