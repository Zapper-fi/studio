import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { CleverFurnace__factory, CleverLocker__factory, CleverVesting__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class CleverContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  cleverFurnace({ address, network }: ContractOpts) {
    return CleverFurnace__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  cleverLocker({ address, network }: ContractOpts) {
    return CleverLocker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  cleverVesting({ address, network }: ContractOpts) {
    return CleverVesting__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { CleverFurnace } from './ethers';
export type { CleverLocker } from './ethers';
export type { CleverVesting } from './ethers';
