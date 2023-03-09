import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { HalofiAbiV001__factory, HalofiAbiV002__factory, HalofiAbiV003__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class HalofiContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  halofiAbiV001({ address, network }: ContractOpts) {
    return HalofiAbiV001__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  halofiAbiV002({ address, network }: ContractOpts) {
    return HalofiAbiV002__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  halofiAbiV003({ address, network }: ContractOpts) {
    return HalofiAbiV003__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { HalofiAbiV001 } from './ethers';
export type { HalofiAbiV002 } from './ethers';
export type { HalofiAbiV003 } from './ethers';
