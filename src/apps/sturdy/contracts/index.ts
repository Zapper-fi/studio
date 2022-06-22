import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SturdyLendingPool__factory } from './ethers';
import { SturdyToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SturdyContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  sturdyLendingPool({ address, network }: ContractOpts) {
    return SturdyLendingPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sturdyToken({ address, network }: ContractOpts) {
    return SturdyToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SturdyLendingPool } from './ethers';
export type { SturdyToken } from './ethers';
