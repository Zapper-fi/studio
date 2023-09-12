import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MahalendProtocolDataProvider__factory } from './ethers';
import { MahalendStakedTokenIncentivesController__factory } from './ethers';
import { MahalendAToken__factory } from './ethers';
import { MahalendLendingPoolProvider__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MahalendContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  aaveProtocolDataProvider({ address, network }: ContractOpts) {
    return MahalendProtocolDataProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aaveStakedTokenIncentivesController({ address, network }: ContractOpts) {
    return MahalendStakedTokenIncentivesController__factory.connect(
      address,
      this.appToolkit.getNetworkProvider(network),
    );
  }
  aaveV2AToken({ address, network }: ContractOpts) {
    return MahalendAToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aaveV2LendingPoolProvider({ address, network }: ContractOpts) {
    return MahalendLendingPoolProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MahalendProtocolDataProvider } from './ethers';
export type { MahalendStakedTokenIncentivesController } from './ethers';
export type { MahalendAToken } from './ethers';
export type { MahalendLendingPoolProvider } from './ethers';
