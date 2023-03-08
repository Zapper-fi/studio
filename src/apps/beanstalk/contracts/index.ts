import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Beanstalk__factory, BeanstalkToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class BeanstalkContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  beanstalk({ address, network }: ContractOpts) {
    return Beanstalk__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  beanstalkToken({ address, network }: ContractOpts) {
    return BeanstalkToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Beanstalk } from './ethers';
export type { BeanstalkToken } from './ethers';
