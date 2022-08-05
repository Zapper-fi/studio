import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AaveProtocolDataProvider__factory } from './ethers';
import { AaveStakedTokenIncentivesController__factory } from './ethers';
import { AaveV2AToken__factory } from './ethers';
import { AaveV2LendingPoolProvider__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AaveV2ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  aaveProtocolDataProvider({ address, network }: ContractOpts) {
    return AaveProtocolDataProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aaveStakedTokenIncentivesController({ address, network }: ContractOpts) {
    return AaveStakedTokenIncentivesController__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aaveV2AToken({ address, network }: ContractOpts) {
    return AaveV2AToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aaveV2LendingPoolProvider({ address, network }: ContractOpts) {
    return AaveV2LendingPoolProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AaveProtocolDataProvider } from './ethers';
export type { AaveStakedTokenIncentivesController } from './ethers';
export type { AaveV2AToken } from './ethers';
export type { AaveV2LendingPoolProvider } from './ethers';
