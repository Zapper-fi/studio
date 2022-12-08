import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Market__factory, Previewer__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ExactlyContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(network => appToolkit.getNetworkProvider(network));
  }

  market({ address, network }: ContractOpts) {
    return Market__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  previewer({ address, network }: ContractOpts) {
    return Previewer__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Market, Previewer } from './ethers';
