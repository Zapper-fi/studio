import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { SturdyLendingPool__factory, SturdyToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SturdyViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  sturdyLendingPool({ address, network }: ContractOpts) {
    return SturdyLendingPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  sturdyToken({ address, network }: ContractOpts) {
    return SturdyToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
