import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  AaveProtocolDataProvider__factory,
  AaveStakedTokenIncentivesController__factory,
  AaveV2AToken__factory,
  AaveV2LendingPoolProvider__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AaveV2ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  aaveProtocolDataProvider({ address, network }: ContractOpts) {
    return AaveProtocolDataProvider__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aaveStakedTokenIncentivesController({ address, network }: ContractOpts) {
    return AaveStakedTokenIncentivesController__factory.connect(
      address,
      this.appToolkit.getViemNetworkProvider(network),
    );
  }
  aaveV2AToken({ address, network }: ContractOpts) {
    return AaveV2AToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aaveV2LendingPoolProvider({ address, network }: ContractOpts) {
    return AaveV2LendingPoolProvider__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
