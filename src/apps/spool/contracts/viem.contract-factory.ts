import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { SpoolStaking__factory, SpoolVault__factory, SpoolVospool__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SpoolViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  spoolStaking({ address, network }: ContractOpts) {
    return SpoolStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  spoolVault({ address, network }: ContractOpts) {
    return SpoolVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  spoolVospool({ address, network }: ContractOpts) {
    return SpoolVospool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
