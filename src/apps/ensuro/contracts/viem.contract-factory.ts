import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { EnsuroEtoken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class EnsuroViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  ensuroEtoken({ address, network }: ContractOpts) {
    return EnsuroEtoken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
