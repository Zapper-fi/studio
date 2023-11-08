import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  GoldfinchSeniorPool__factory,
  GoldfinchStakingRewards__factory,
  GoldfinchVault__factory,
  GoldfinchWithdrawalRequestToken__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class GoldfinchViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  goldfinchSeniorPool({ address, network }: ContractOpts) {
    return GoldfinchSeniorPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  goldfinchStakingRewards({ address, network }: ContractOpts) {
    return GoldfinchStakingRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  goldfinchVault({ address, network }: ContractOpts) {
    return GoldfinchVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  goldfinchWithdrawalRequestToken({ address, network }: ContractOpts) {
    return GoldfinchWithdrawalRequestToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
