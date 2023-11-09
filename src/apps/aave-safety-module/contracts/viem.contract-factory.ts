import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  AaveAbpt__factory,
  AaveBpt__factory,
  AaveStkAave__factory,
  AaveStkAbpt__factory,
  AaveStkApyHelper__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AaveSafetyModuleViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  aaveAbpt({ address, network }: ContractOpts) {
    return AaveAbpt__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aaveBpt({ address, network }: ContractOpts) {
    return AaveBpt__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aaveStkAave({ address, network }: ContractOpts) {
    return AaveStkAave__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aaveStkAbpt({ address, network }: ContractOpts) {
    return AaveStkAbpt__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aaveStkApyHelper({ address, network }: ContractOpts) {
    return AaveStkApyHelper__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
