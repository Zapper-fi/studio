import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  UwuLendDataProvider__factory,
  UwuLendStakingV1__factory,
  UwuLendStakingV2__factory,
  UwuLendUToken__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class UwuLendContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  uwuLendDataProvider({ address, network }: ContractOpts) {
    return UwuLendDataProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  uwuLendStakingV1({ address, network }: ContractOpts) {
    return UwuLendStakingV1__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  uwuLendStakingV2({ address, network }: ContractOpts) {
    return UwuLendStakingV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  uwuLendUToken({ address, network }: ContractOpts) {
    return UwuLendUToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { UwuLendDataProvider } from './ethers';
export type { UwuLendStakingV1 } from './ethers';
export type { UwuLendStakingV2 } from './ethers';
export type { UwuLendUToken } from './ethers';
