import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AaveAmmAToken__factory } from './ethers';
import { AaveAmmLendingPool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AaveAmmContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  aaveAmmAToken({ address, network }: ContractOpts) {
    return AaveAmmAToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aaveAmmLendingPool({ address, network }: ContractOpts) {
    return AaveAmmLendingPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AaveAmmAToken } from './ethers';
export type { AaveAmmLendingPool } from './ethers';
