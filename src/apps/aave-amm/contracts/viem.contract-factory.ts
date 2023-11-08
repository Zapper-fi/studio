import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { AaveAmmAToken__factory, AaveAmmLendingPool__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AaveAmmViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  aaveAmmAToken({ address, network }: ContractOpts) {
    return AaveAmmAToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aaveAmmLendingPool({ address, network }: ContractOpts) {
    return AaveAmmLendingPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
