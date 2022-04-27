import { Injectable, Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { KeeperDaoLiquidityPoolDistributor__factory } from './ethers';
import { KeeperDaoLiquidityPoolV2__factory } from './ethers';
type ContractOpts = { address: string; network: Network };

@Injectable()
export class KeeperDaoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  keeperDaoLiquidityPoolDistributor({ address, network }: ContractOpts) {
    return KeeperDaoLiquidityPoolDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  keeperDaoLiquidityPoolV2({ address, network }: ContractOpts) {
    return KeeperDaoLiquidityPoolV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { KeeperDaoLiquidityPoolDistributor } from './ethers';
export type { KeeperDaoLiquidityPoolV2 } from './ethers';
