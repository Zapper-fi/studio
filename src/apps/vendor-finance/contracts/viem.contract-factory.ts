import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  VendorFinancePool__factory,
  VendorFinancePoolV2__factory,
  VendorFinancePositionTracker__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class VendorFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  vendorFinancePool({ address, network }: ContractOpts) {
    return VendorFinancePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  vendorFinancePoolV2({ address, network }: ContractOpts) {
    return VendorFinancePoolV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  vendorFinancePositionTracker({ address, network }: ContractOpts) {
    return VendorFinancePositionTracker__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
