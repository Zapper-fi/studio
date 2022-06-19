import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { DhedgeFactory__factory } from './ethers';
import { DhedgePool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class DhedgeV2ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  dhedgeFactory({ address, network }: ContractOpts) {
    return DhedgeFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dhedgePool({ address, network }: ContractOpts) {
    return DhedgePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { DhedgeFactory } from './ethers';
export type { DhedgePool } from './ethers';
