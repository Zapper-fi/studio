import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { IndexCoopStaking__factory, IndexCoopToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class IndexCoopViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  indexCoopStaking({ address, network }: ContractOpts) {
    return IndexCoopStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  indexCoopToken({ address, network }: ContractOpts) {
    return IndexCoopToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
