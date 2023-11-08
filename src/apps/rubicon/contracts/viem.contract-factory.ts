import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { BathToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RubiconViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  bathToken({ address, network }: ContractOpts) {
    return BathToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
