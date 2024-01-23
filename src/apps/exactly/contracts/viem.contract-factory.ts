import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { InterestRateModel__factory, Market__factory, Previewer__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ExactlyViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  interestRateModel({ address, network }: ContractOpts) {
    return InterestRateModel__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  market({ address, network }: ContractOpts) {
    return Market__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  previewer({ address, network }: ContractOpts) {
    return Previewer__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
