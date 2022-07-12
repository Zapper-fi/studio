import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { VelodromeGauge__factory } from './ethers';
import { VelodromePool__factory } from './ethers';
import { VelodromeVe__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class VelodromeContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  velodromeGauge({ address, network }: ContractOpts) {
    return VelodromeGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  velodromePool({ address, network }: ContractOpts) {
    return VelodromePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  velodromeVe({ address, network }: ContractOpts) {
    return VelodromeVe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { VelodromeGauge } from './ethers';
export type { VelodromePool } from './ethers';
export type { VelodromeVe } from './ethers';
