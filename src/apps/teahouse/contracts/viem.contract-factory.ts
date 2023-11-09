import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { TeahouseVault__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class TeahouseViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  teahouseVault({ address, network }: ContractOpts) {
    return TeahouseVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
