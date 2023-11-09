import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { BeethovenXBeetsBar__factory, BeethovenXGauge__factory, BeethovenXMasterchef__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class BeethovenXViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  beethovenXBeetsBar({ address, network }: ContractOpts) {
    return BeethovenXBeetsBar__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  beethovenXGauge({ address, network }: ContractOpts) {
    return BeethovenXGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  beethovenXMasterchef({ address, network }: ContractOpts) {
    return BeethovenXMasterchef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
