import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { OpenSkyDataProvider__factory } from './ethers';
import { OpenSkyOToken__factory } from './ethers';
import { OpenSkyPool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class OpenskyContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  openSkyDataProvider({ address, network }: ContractOpts) {
    return OpenSkyDataProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  openSkyOToken({ address, network }: ContractOpts) {
    return OpenSkyOToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  openSkyPool({ address, network }: ContractOpts) {
    return OpenSkyPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { OpenSkyDataProvider } from './ethers';
export type { OpenSkyOToken } from './ethers';
export type { OpenSkyPool } from './ethers';
