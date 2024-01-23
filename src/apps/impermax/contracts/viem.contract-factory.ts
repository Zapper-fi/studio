import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { Borrowable__factory, Collateral__factory, Factory__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ImpermaxViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  borrowable({ address, network }: ContractOpts) {
    return Borrowable__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  collateral({ address, network }: ContractOpts) {
    return Collateral__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  factory({ address, network }: ContractOpts) {
    return Factory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
