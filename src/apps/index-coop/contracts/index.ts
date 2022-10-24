import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { IndexCoopStaking__factory } from './ethers';
import { IndexCoopToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class IndexCoopContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  indexCoopStaking({ address, network }: ContractOpts) {
    return IndexCoopStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  indexCoopToken({ address, network }: ContractOpts) {
    return IndexCoopToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { IndexCoopStaking } from './ethers';
export type { IndexCoopToken } from './ethers';
