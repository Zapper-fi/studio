import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  SolidLizardBribe__factory,
  SolidLizardGauge__factory,
  SolidLizardPool__factory,
  SolidLizardRewards__factory,
  SolidLizardVe__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SolidLizardContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  solidLizardBribe({ address, network }: ContractOpts) {
    return SolidLizardBribe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  solidLizardGauge({ address, network }: ContractOpts) {
    return SolidLizardGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  solidLizardPool({ address, network }: ContractOpts) {
    return SolidLizardPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  solidLizardRewards({ address, network }: ContractOpts) {
    return SolidLizardRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  solidLizardVe({ address, network }: ContractOpts) {
    return SolidLizardVe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SolidLizardBribe } from './ethers';
export type { SolidLizardGauge } from './ethers';
export type { SolidLizardPool } from './ethers';
export type { SolidLizardRewards } from './ethers';
export type { SolidLizardVe } from './ethers';
