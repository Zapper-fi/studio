import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MeanFinanceHub__factory } from './ethers';
import { MeanFinancePermissionManager__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MeanFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  meanFinanceHub({ address, network }: ContractOpts) {
    return MeanFinanceHub__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  meanFinancePermissionManager({ address, network }: ContractOpts) {
    return MeanFinancePermissionManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MeanFinanceHub } from './ethers';
export type { MeanFinancePermissionManager } from './ethers';
