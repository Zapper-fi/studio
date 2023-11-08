import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { BarnbridgeSmartAlphaPool__factory, BarnbridgeSmartAlphaToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class BarnbridgeSmartAlphaViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  barnbridgeSmartAlphaPool({ address, network }: ContractOpts) {
    return BarnbridgeSmartAlphaPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  barnbridgeSmartAlphaToken({ address, network }: ContractOpts) {
    return BarnbridgeSmartAlphaToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
