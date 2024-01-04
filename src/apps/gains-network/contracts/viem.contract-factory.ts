import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  GainsNetworkGToken__factory,
  GainsNetworkLockedDepositNft__factory,
  GainsNetworkStaking__factory,
  GainsNetworkStakingV2__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class GainsNetworkViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  gainsNetworkGToken({ address, network }: ContractOpts) {
    return GainsNetworkGToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  gainsNetworkLockedDepositNft({ address, network }: ContractOpts) {
    return GainsNetworkLockedDepositNft__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  gainsNetworkStaking({ address, network }: ContractOpts) {
    return GainsNetworkStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  gainsNetworkStakingV2({ address, network }: ContractOpts) {
    return GainsNetworkStakingV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
