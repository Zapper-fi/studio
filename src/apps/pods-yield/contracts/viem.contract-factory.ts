import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { PodsYieldVault__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PodsYieldViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  podsYieldVault({ address, network }: ContractOpts) {
    return PodsYieldVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
