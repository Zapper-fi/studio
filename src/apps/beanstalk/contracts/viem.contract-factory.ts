import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { Beanstalk__factory, BeanstalkToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class BeanstalkViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  beanstalk({ address, network }: ContractOpts) {
    return Beanstalk__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  beanstalkToken({ address, network }: ContractOpts) {
    return BeanstalkToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
