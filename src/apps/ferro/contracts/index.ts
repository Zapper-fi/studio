import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { FerroBar__factory } from './ethers';
import { FerroBoost__factory } from './ethers';
import { FerroFarm__factory } from './ethers';
import { FerroSwap__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class FerroContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  ferroBar({ address, network }: ContractOpts) {
    return FerroBar__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ferroBoost({ address, network }: ContractOpts) {
    return FerroBoost__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ferroFarm({ address, network }: ContractOpts) {
    return FerroFarm__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ferroSwap({ address, network }: ContractOpts) {
    return FerroSwap__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { FerroBar } from './ethers';
export type { FerroBoost } from './ethers';
export type { FerroFarm } from './ethers';
export type { FerroSwap } from './ethers';
