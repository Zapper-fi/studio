import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  VelodromeBribe__factory,
  VelodromeFees__factory,
  VelodromeGauge__factory,
  VelodromePool__factory,
  VelodromeRewards__factory,
  VelodromeVe__factory,
  VelodromeVoter__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class VelodromeViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  velodromeBribe({ address, network }: ContractOpts) {
    return VelodromeBribe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velodromeFees({ address, network }: ContractOpts) {
    return VelodromeFees__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velodromeGauge({ address, network }: ContractOpts) {
    return VelodromeGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velodromePool({ address, network }: ContractOpts) {
    return VelodromePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velodromeRewards({ address, network }: ContractOpts) {
    return VelodromeRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velodromeVe({ address, network }: ContractOpts) {
    return VelodromeVe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velodromeVoter({ address, network }: ContractOpts) {
    return VelodromeVoter__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
