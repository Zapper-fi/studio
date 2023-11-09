import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { YieldYakChef__factory, YieldYakVault__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class YieldYakViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  yieldYakChef({ address, network }: ContractOpts) {
    return YieldYakChef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  yieldYakVault({ address, network }: ContractOpts) {
    return YieldYakVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
