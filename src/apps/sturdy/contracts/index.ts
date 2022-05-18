import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SturdyDai__factory } from './ethers';
import { SturdyFusdt__factory } from './ethers';
import { SturdyUsdc__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SturdyContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  sturdyDai({ address, network }: ContractOpts) {
    return SturdyDai__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sturdyFusdt({ address, network }: ContractOpts) {
    return SturdyFusdt__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sturdyUsdc({ address, network }: ContractOpts) {
    return SturdyUsdc__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SturdyDai } from './ethers';
export type { SturdyFusdt } from './ethers';
export type { SturdyUsdc } from './ethers';
