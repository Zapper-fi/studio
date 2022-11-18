import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { LemmaSynth__factory } from './ethers';
import { Usdl__factory } from './ethers';
import { XLemmaSynth__factory } from './ethers';
import { Xusdl__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LemmafinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  lemmaSynth({ address, network }: ContractOpts) {
    return LemmaSynth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  usdl({ address, network }: ContractOpts) {
    return Usdl__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  xLemmaSynth({ address, network }: ContractOpts) {
    return XLemmaSynth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  xusdl({ address, network }: ContractOpts) {
    return Xusdl__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { LemmaSynth } from './ethers';
export type { Usdl } from './ethers';
export type { XLemmaSynth } from './ethers';
export type { Xusdl } from './ethers';
