import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { DhedgeV2Factory__factory } from './ethers';
import { DhedgeV2Token__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class DhedgeV2ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  dhedgeV2Factory({ address, network }: ContractOpts) {
    return DhedgeV2Factory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dhedgeV2Token({ address, network }: ContractOpts) {
    return DhedgeV2Token__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { DhedgeV2Factory } from './ethers';
export type { DhedgeV2Token } from './ethers';
