import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  GainsNetworkGToken__factory,
  GainsNetworkLockedDepositNft__factory,
  GainsNetworkStaking__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class GainsNetworkContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  gainsNetworkGToken({ address, network }: ContractOpts) {
    return GainsNetworkGToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  gainsNetworkLockedDepositNft({ address, network }: ContractOpts) {
    return GainsNetworkLockedDepositNft__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  gainsNetworkStaking({ address, network }: ContractOpts) {
    return GainsNetworkStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { GainsNetworkGToken } from './ethers';
export type { GainsNetworkLockedDepositNft } from './ethers';
export type { GainsNetworkStaking } from './ethers';
