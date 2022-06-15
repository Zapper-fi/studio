import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AgaveBaseIncentivesController__factory } from './ethers';
import { AgaveLendingPoolProvider__factory } from './ethers';
import { AgaveProtocolDataProvider__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AgaveContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  agaveBaseIncentivesController({ address, network }: ContractOpts) {
    return AgaveBaseIncentivesController__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  agaveLendingPoolProvider({ address, network }: ContractOpts) {
    return AgaveLendingPoolProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  agaveProtocolDataProvider({ address, network }: ContractOpts) {
    return AgaveProtocolDataProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AgaveBaseIncentivesController } from './ethers';
export type { AgaveLendingPoolProvider } from './ethers';
export type { AgaveProtocolDataProvider } from './ethers';
