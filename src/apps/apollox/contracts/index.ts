import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Alp__factory, AlpStaking__factory, Apx__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ApolloxContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  alp({ address, network }: ContractOpts) {
    return Alp__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  alpStaking({ address, network }: ContractOpts) {
    return AlpStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  apx({ address, network }: ContractOpts) {
    return Apx__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Alp } from './ethers';
export type { AlpStaking } from './ethers';
export type { Apx } from './ethers';
