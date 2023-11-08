import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  WombatExchangeMasterWombat__factory,
  WombatExchangePool__factory,
  WombatExchangePoolToken__factory,
  WombatExchangeVotingEscrow__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class WombatExchangeContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  wombatExchangeMasterWombat({ address, network }: ContractOpts) {
    return WombatExchangeMasterWombat__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  wombatExchangePool({ address, network }: ContractOpts) {
    return WombatExchangePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  wombatExchangePoolToken({ address, network }: ContractOpts) {
    return WombatExchangePoolToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  wombatExchangeVotingEscrow({ address, network }: ContractOpts) {
    return WombatExchangeVotingEscrow__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { WombatExchangeMasterWombat } from './ethers';
export type { WombatExchangePool } from './ethers';
export type { WombatExchangePoolToken } from './ethers';
export type { WombatExchangeVotingEscrow } from './ethers';
