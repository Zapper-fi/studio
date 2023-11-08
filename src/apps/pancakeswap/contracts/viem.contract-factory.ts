import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  PancakeswapCakeChef__factory,
  PancakeswapChef__factory,
  PancakeswapChefV2__factory,
  PancakeswapFactory__factory,
  PancakeswapFarmBooster__factory,
  PancakeswapIfoChef__factory,
  PancakeswapPair__factory,
  PancakeswapSmartChef__factory,
  PancakeswapSmartChefInit__factory,
  PancakeswapStablePool__factory,
  PancakeswapStablePoolRegistry__factory,
  PancakeswapSyrupCake__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PancakeswapViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  pancakeswapCakeChef({ address, network }: ContractOpts) {
    return PancakeswapCakeChef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapChef({ address, network }: ContractOpts) {
    return PancakeswapChef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapChefV2({ address, network }: ContractOpts) {
    return PancakeswapChefV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapFactory({ address, network }: ContractOpts) {
    return PancakeswapFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapFarmBooster({ address, network }: ContractOpts) {
    return PancakeswapFarmBooster__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapIfoChef({ address, network }: ContractOpts) {
    return PancakeswapIfoChef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapPair({ address, network }: ContractOpts) {
    return PancakeswapPair__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapSmartChef({ address, network }: ContractOpts) {
    return PancakeswapSmartChef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapSmartChefInit({ address, network }: ContractOpts) {
    return PancakeswapSmartChefInit__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapStablePool({ address, network }: ContractOpts) {
    return PancakeswapStablePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapStablePoolRegistry({ address, network }: ContractOpts) {
    return PancakeswapStablePoolRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pancakeswapSyrupCake({ address, network }: ContractOpts) {
    return PancakeswapSyrupCake__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
