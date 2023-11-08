import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { PhutureManagedIndex__factory, PhutureVToken__factory, PhutureVTokenFactory__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PhutureViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  phutureManagedIndex({ address, network }: ContractOpts) {
    return PhutureManagedIndex__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  phutureVToken({ address, network }: ContractOpts) {
    return PhutureVToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  phutureVTokenFactory({ address, network }: ContractOpts) {
    return PhutureVTokenFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
