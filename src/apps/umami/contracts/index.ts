import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { UmamiCompound__factory } from './ethers';
import { UmamiMarinate__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class UmamiContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  umamiCompound({ address, network }: ContractOpts) {
    return UmamiCompound__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  umamiMarinate({ address, network }: ContractOpts) {
    return UmamiMarinate__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { UmamiCompound } from './ethers';
export type { UmamiMarinate } from './ethers';
