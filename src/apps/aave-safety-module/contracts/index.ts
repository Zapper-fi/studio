import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AaveAbpt__factory } from './ethers';
import { AaveBpt__factory } from './ethers';
import { AaveStkAave__factory } from './ethers';
import { AaveStkAbpt__factory } from './ethers';
import { AaveStkApyHelper__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AaveSafetyModuleContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  aaveAbpt({ address, network }: ContractOpts) {
    return AaveAbpt__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aaveBpt({ address, network }: ContractOpts) {
    return AaveBpt__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aaveStkAave({ address, network }: ContractOpts) {
    return AaveStkAave__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aaveStkAbpt({ address, network }: ContractOpts) {
    return AaveStkAbpt__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aaveStkApyHelper({ address, network }: ContractOpts) {
    return AaveStkApyHelper__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AaveAbpt } from './ethers';
export type { AaveBpt } from './ethers';
export type { AaveStkAave } from './ethers';
export type { AaveStkAbpt } from './ethers';
export type { AaveStkApyHelper } from './ethers';
