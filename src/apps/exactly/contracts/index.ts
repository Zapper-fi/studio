import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { InterestRateModel__factory, Market__factory, Previewer__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ExactlyContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(network => appToolkit.getNetworkProvider(network));
  }

  interestRateModel({ address, network }: ContractOpts) {
    return InterestRateModel__factory.connect(address, this.networkProviderResolver(network));
  }
  market({ address, network }: ContractOpts) {
    return Market__factory.connect(address, this.networkProviderResolver(network));
  }
  previewer({ address, network }: ContractOpts) {
    return Previewer__factory.connect(address, this.networkProviderResolver(network));
  }
}

export type { InterestRateModel, Market, Previewer } from './ethers';
