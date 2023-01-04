import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Steth__factory, StethEthOracle__factory, Wsteth__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LidoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  steth({ address, network }: ContractOpts) {
    return Steth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stethEthOracle({ address, network }: ContractOpts) {
    return StethEthOracle__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  wsteth({ address, network }: ContractOpts) {
    return Wsteth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Steth } from './ethers';
export type { StethEthOracle } from './ethers';
export type { Wsteth } from './ethers';
