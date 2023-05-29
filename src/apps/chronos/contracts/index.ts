import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { ChronosFactory__factory, ChronosPool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ChronosContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  chronosFactory({ address, network }: ContractOpts) {
    return ChronosFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  chronosPool({ address, network }: ContractOpts) {
    return ChronosPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { ChronosFactory } from './ethers';
export type { ChronosPool } from './ethers';
