import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { UnstoppableGlpVault__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class UnstoppableViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  unstoppableGlpVault({ address, network }: ContractOpts) {
    return UnstoppableGlpVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
