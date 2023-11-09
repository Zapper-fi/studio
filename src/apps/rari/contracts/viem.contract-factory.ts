import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  RariFundManager__factory,
  RariGovernanceTokenDistributor__factory,
  RariUniswapTokenDistributor__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RariViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  rariFundManager({ address, network }: ContractOpts) {
    return RariFundManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rariGovernanceTokenDistributor({ address, network }: ContractOpts) {
    return RariGovernanceTokenDistributor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rariUniswapTokenDistributor({ address, network }: ContractOpts) {
    return RariUniswapTokenDistributor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
