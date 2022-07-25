import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Veogv__factory } from './ethers';
import { Wousd__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class OriginDollarContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  veogv({ address, network }: ContractOpts) {
    return Veogv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  wousd({ address, network }: ContractOpts) {
    return Wousd__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Veogv } from './ethers';
export type { Wousd } from './ethers';
