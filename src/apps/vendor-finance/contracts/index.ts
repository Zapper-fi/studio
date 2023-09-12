import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  VendorFinancePool__factory,
  VendorFinancePoolV2__factory,
  VendorFinancePositionTracker__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class VendorFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  vendorFinancePool({ address, network }: ContractOpts) {
    return VendorFinancePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vendorFinancePoolV2({ address, network }: ContractOpts) {
    return VendorFinancePoolV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vendorFinancePositionTracker({ address, network }: ContractOpts) {
    return VendorFinancePositionTracker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { VendorFinancePool } from './ethers';
export type { VendorFinancePoolV2 } from './ethers';
export type { VendorFinancePositionTracker } from './ethers';
