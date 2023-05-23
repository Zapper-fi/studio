import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  Governance__factory,
  GrgVault__factory,
  PoolRegistry__factory,
  SmartPool__factory,
  Staking__factory,
  TokenWhitelist__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class RigoblockContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  governance({ address, network }: ContractOpts) {
    return Governance__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  grgVault({ address, network }: ContractOpts) {
    return GrgVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolRegistry({ address, network }: ContractOpts) {
    return PoolRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  smartPool({ address, network }: ContractOpts) {
    return SmartPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  staking({ address, network }: ContractOpts) {
    return Staking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tokenWhitelist({ address, network }: ContractOpts) {
    return TokenWhitelist__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Governance } from './ethers';
export type { GrgVault } from './ethers';
export type { PoolRegistry } from './ethers';
export type { SmartPool } from './ethers';
export type { Staking } from './ethers';
export type { TokenWhitelist } from './ethers';
