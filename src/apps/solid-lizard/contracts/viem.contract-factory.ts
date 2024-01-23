import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  SolidLizardBribe__factory,
  SolidLizardGauge__factory,
  SolidLizardPool__factory,
  SolidLizardRewards__factory,
  SolidLizardVe__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SolidLizardViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  solidLizardBribe({ address, network }: ContractOpts) {
    return SolidLizardBribe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  solidLizardGauge({ address, network }: ContractOpts) {
    return SolidLizardGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  solidLizardPool({ address, network }: ContractOpts) {
    return SolidLizardPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  solidLizardRewards({ address, network }: ContractOpts) {
    return SolidLizardRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  solidLizardVe({ address, network }: ContractOpts) {
    return SolidLizardVe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
