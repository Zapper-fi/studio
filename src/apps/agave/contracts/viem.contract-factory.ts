import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  AgaveBaseIncentivesController__factory,
  AgaveLendingPoolProvider__factory,
  AgaveProtocolDataProvider__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AgaveViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  agaveBaseIncentivesController({ address, network }: ContractOpts) {
    return AgaveBaseIncentivesController__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  agaveLendingPoolProvider({ address, network }: ContractOpts) {
    return AgaveLendingPoolProvider__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  agaveProtocolDataProvider({ address, network }: ContractOpts) {
    return AgaveProtocolDataProvider__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
