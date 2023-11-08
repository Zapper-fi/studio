import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { GroLabsVault__factory, GroLpTokenStaker__factory, GroVesting__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class GroViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  groLabsVault({ address, network }: ContractOpts) {
    return GroLabsVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  groLpTokenStaker({ address, network }: ContractOpts) {
    return GroLpTokenStaker__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  groVesting({ address, network }: ContractOpts) {
    return GroVesting__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
