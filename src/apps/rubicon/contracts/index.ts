import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { BathToken__factory } from './ethers';
import { Ierc20__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class RubiconContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  bathToken({ address, network }: ContractOpts) {
    return BathToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ierc20({ address, network }: ContractOpts) {
    return Ierc20__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BathToken } from './ethers';
export type { Ierc20 } from './ethers';
