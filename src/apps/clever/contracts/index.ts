import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  AbcCvx__factory,
  CleverFurnace__factory,
  CleverGauge__factory,
  CleverGaugeController__factory,
  CleverLocker__factory,
  CleverVesting__factory
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class CleverContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  abcCvx({ address, network }: ContractOpts) {
    return AbcCvx__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  cleverFurnace({ address, network }: ContractOpts) {
    return CleverFurnace__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  cleverGauge({ address, network }: ContractOpts) {
    return CleverGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  cleverGaugeController({ address, network }: ContractOpts) {
    return CleverGaugeController__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  cleverLocker({ address, network }: ContractOpts) {
    return CleverLocker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  cleverVesting({ address, network }: ContractOpts) {
    return CleverVesting__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AbcCvx } from './ethers';
export type { CleverFurnace } from './ethers';
export type { CleverGauge } from './ethers';
export type { CleverGaugeController } from './ethers';
export type { CleverLocker } from './ethers';
export type { CleverVesting } from './ethers';
