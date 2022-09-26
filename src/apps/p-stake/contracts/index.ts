import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PStakePool__factory } from './ethers';
import { PStakeStkToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PStakeContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  pStakePool({ address, network }: ContractOpts) {
    return PStakePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pStakeStkToken({ address, network }: ContractOpts) {
    return PStakeStkToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PStakePool } from './ethers';
export type { PStakeStkToken } from './ethers';
