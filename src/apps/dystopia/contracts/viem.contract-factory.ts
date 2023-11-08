import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { DystopiaGauge__factory, DystopiaPair__factory, DystopiaVe__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class DystopiaViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  dystopiaGauge({ address, network }: ContractOpts) {
    return DystopiaGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dystopiaPair({ address, network }: ContractOpts) {
    return DystopiaPair__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dystopiaVe({ address, network }: ContractOpts) {
    return DystopiaVe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
