import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  HectorNetworkBondDepository__factory,
  HectorNetworkBondNoTreasury__factory,
  HectorNetworkStakeBondDepository__factory,
  HectorNetworkStaked__factory,
  HectorNetworkStakingRewards__factory,
  HectorNetworkToken__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class HectorNetworkViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  hectorNetworkBondDepository({ address, network }: ContractOpts) {
    return HectorNetworkBondDepository__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  hectorNetworkBondNoTreasury({ address, network }: ContractOpts) {
    return HectorNetworkBondNoTreasury__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  hectorNetworkStakeBondDepository({ address, network }: ContractOpts) {
    return HectorNetworkStakeBondDepository__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  hectorNetworkStaked({ address, network }: ContractOpts) {
    return HectorNetworkStaked__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  hectorNetworkStakingRewards({ address, network }: ContractOpts) {
    return HectorNetworkStakingRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  hectorNetworkToken({ address, network }: ContractOpts) {
    return HectorNetworkToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
