import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { UwuLendDataProvider__factory, UwuLendUToken__factory } from './ethers';

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
  uwuLendUToken({ address, network }: ContractOpts) {
    return UwuLendUToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { UwuLendDataProvider } from './ethers';
export type { UwuLendUToken } from './ethers';
