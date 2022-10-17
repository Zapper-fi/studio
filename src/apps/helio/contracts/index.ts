import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { HelioHay__factory } from './ethers';
import { HelioJar__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class HelioContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  helioHay({ address, network }: ContractOpts) {
    return HelioHay__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  helioJar({ address, network }: ContractOpts) {
    return HelioJar__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { HelioHay } from './ethers';
export type { HelioJar } from './ethers';
