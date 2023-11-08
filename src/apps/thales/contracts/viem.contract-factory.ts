import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  Amm__factory,
  EscrowThales__factory,
  LpStaking__factory,
  StakingThales__factory,
  Vaults__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ThalesViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  amm({ address, network }: ContractOpts) {
    return Amm__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  escrowThales({ address, network }: ContractOpts) {
    return EscrowThales__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lpStaking({ address, network }: ContractOpts) {
    return LpStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stakingThales({ address, network }: ContractOpts) {
    return StakingThales__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  vaults({ address, network }: ContractOpts) {
    return Vaults__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
