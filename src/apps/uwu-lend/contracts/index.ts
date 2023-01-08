import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  UwuLendDataProvider__factory,
  UwuLendMultiFeeV1__factory,
  UwuLendMultiFeeV2__factory,
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
  uwuLendMultiFeeV1({ address, network }: ContractOpts) {
    return UwuLendMultiFeeV1__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  uwuLendMultiFeeV2({ address, network }: ContractOpts) {
    return UwuLendMultiFeeV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  uwuLendUToken({ address, network }: ContractOpts) {
    return UwuLendUToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { UwuLendDataProvider } from './ethers';
export type { UwuLendMultiFeeV1 } from './ethers';
export type { UwuLendMultiFeeV2 } from './ethers';
export type { UwuLendUToken } from './ethers';
