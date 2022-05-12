import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { GroDistributor__factory } from './ethers';
import { GroLabsVault__factory } from './ethers';
import { GroLpTokenStaker__factory } from './ethers';
import { GroVesting__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class GroContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  groDistributor({ address, network }: ContractOpts) {
    return GroDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  groLabsVault({ address, network }: ContractOpts) {
    return GroLabsVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  groLpTokenStaker({ address, network }: ContractOpts) {
    return GroLpTokenStaker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  groVesting({ address, network }: ContractOpts) {
    return GroVesting__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { GroDistributor } from './ethers';
export type { GroLabsVault } from './ethers';
export type { GroLpTokenStaker } from './ethers';
export type { GroVesting } from './ethers';
