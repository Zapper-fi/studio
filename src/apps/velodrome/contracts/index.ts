import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  VelodromeBribe__factory,
  VelodromeFees__factory,
  VelodromeGauge__factory,
  VelodromePool__factory,
  VelodromeRewards__factory,
  VelodromeVe__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class VelodromeContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  velodromeBribe({ address, network }: ContractOpts) {
    return VelodromeBribe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  velodromeFees({ address, network }: ContractOpts) {
    return VelodromeFees__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  velodromeGauge({ address, network }: ContractOpts) {
    return VelodromeGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  velodromePool({ address, network }: ContractOpts) {
    return VelodromePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  velodromeRewards({ address, network }: ContractOpts) {
    return VelodromeRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  velodromeVe({ address, network }: ContractOpts) {
    return VelodromeVe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { VelodromeBribe } from './ethers';
export type { VelodromeFees } from './ethers';
export type { VelodromeGauge } from './ethers';
export type { VelodromePool } from './ethers';
export type { VelodromeRewards } from './ethers';
export type { VelodromeVe } from './ethers';
