import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  SaddleCommunalFarm__factory,
  SaddleMiniChefV2__factory,
  SaddleMiniChefV2Rewarder__factory,
  SaddleSwap__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SaddleViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  saddleCommunalFarm({ address, network }: ContractOpts) {
    return SaddleCommunalFarm__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  saddleMiniChefV2({ address, network }: ContractOpts) {
    return SaddleMiniChefV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  saddleMiniChefV2Rewarder({ address, network }: ContractOpts) {
    return SaddleMiniChefV2Rewarder__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  saddleSwap({ address, network }: ContractOpts) {
    return SaddleSwap__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
