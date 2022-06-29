import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Hub__factory } from './ethers';
import { PermissionManager__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MeanFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  hub({ address, network }: ContractOpts) {
    return Hub__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  permissionManager({ address, network }: ContractOpts) {
    return PermissionManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Hub } from './ethers';
export type { PermissionManager } from './ethers';
