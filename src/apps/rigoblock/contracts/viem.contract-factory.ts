import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  Governance__factory,
  GrgVault__factory,
  PoolRegistry__factory,
  SmartPool__factory,
  Staking__factory,
  TokenWhitelist__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RigoblockViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  governance({ address, network }: ContractOpts) {
    return Governance__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  grgVault({ address, network }: ContractOpts) {
    return GrgVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolRegistry({ address, network }: ContractOpts) {
    return PoolRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  smartPool({ address, network }: ContractOpts) {
    return SmartPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  staking({ address, network }: ContractOpts) {
    return Staking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tokenWhitelist({ address, network }: ContractOpts) {
    return TokenWhitelist__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
