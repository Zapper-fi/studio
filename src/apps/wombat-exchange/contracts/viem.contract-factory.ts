import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  WombatExchangeMasterWombat__factory,
  WombatExchangePool__factory,
  WombatExchangePoolToken__factory,
  WombatExchangeVotingEscrow__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class WombatExchangeViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  wombatExchangeMasterWombat({ address, network }: ContractOpts) {
    return WombatExchangeMasterWombat__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  wombatExchangePool({ address, network }: ContractOpts) {
    return WombatExchangePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  wombatExchangePoolToken({ address, network }: ContractOpts) {
    return WombatExchangePoolToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  wombatExchangeVotingEscrow({ address, network }: ContractOpts) {
    return WombatExchangeVotingEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
