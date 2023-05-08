import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { ApxBtrfly__factory, ApxGlp__factory, ApxGmx__factory, PirexPxCvx__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PirexContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  apxBtrfly({ address, network }: ContractOpts) {
    return ApxBtrfly__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  apxGlp({ address, network }: ContractOpts) {
    return ApxGlp__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  apxGmx({ address, network }: ContractOpts) {
    return ApxGmx__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pirexPxCvx({ address, network }: ContractOpts) {
    return PirexPxCvx__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { ApxBtrfly } from './ethers';
export type { ApxGlp } from './ethers';
export type { ApxGmx } from './ethers';
export type { PirexPxCvx } from './ethers';
