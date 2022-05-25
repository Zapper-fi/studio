import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SaddleCommunalFarm__factory } from './ethers';
import { SaddleMiniChefV2__factory } from './ethers';
import { SaddleMiniChefV2Rewarder__factory } from './ethers';
import { SaddleSwap__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SaddleContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  saddleCommunalFarm({ address, network }: ContractOpts) {
    return SaddleCommunalFarm__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  saddleMiniChefV2({ address, network }: ContractOpts) {
    return SaddleMiniChefV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  saddleMiniChefV2Rewarder({ address, network }: ContractOpts) {
    return SaddleMiniChefV2Rewarder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  saddleSwap({ address, network }: ContractOpts) {
    return SaddleSwap__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SaddleCommunalFarm } from './ethers';
export type { SaddleMiniChefV2 } from './ethers';
export type { SaddleMiniChefV2Rewarder } from './ethers';
export type { SaddleSwap } from './ethers';
