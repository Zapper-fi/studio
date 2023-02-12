import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { CleverAbcCvxGauge__factory, CleverFurnace__factory, CleverLocker__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class CleverContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  cleverAbcCvxGauge({ address, network }: ContractOpts) {
    return CleverAbcCvxGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  cleverFurnace({ address, network }: ContractOpts) {
    return CleverFurnace__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  cleverLocker({ address, network }: ContractOpts) {
    return CleverLocker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { CleverAbcCvxGauge } from './ethers';
export type { CleverFurnace } from './ethers';
export type { CleverLocker } from './ethers';
