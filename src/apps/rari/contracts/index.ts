import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { RariFundManager__factory } from './ethers';
import { RariGovernanceTokenDistributor__factory } from './ethers';
import { RariUniswapTokenDistributor__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class RariContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  rariFundManager({ address, network }: ContractOpts) {
    return RariFundManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rariGovernanceTokenDistributor({ address, network }: ContractOpts) {
    return RariGovernanceTokenDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rariUniswapTokenDistributor({ address, network }: ContractOpts) {
    return RariUniswapTokenDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { RariFundManager } from './ethers';
export type { RariGovernanceTokenDistributor } from './ethers';
export type { RariUniswapTokenDistributor } from './ethers';
