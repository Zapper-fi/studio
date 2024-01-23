import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { CompoundCToken__factory, CompoundComptroller__factory, CompoundLens__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class CompoundViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  compoundCToken({ address, network }: ContractOpts) {
    return CompoundCToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  compoundComptroller({ address, network }: ContractOpts) {
    return CompoundComptroller__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  compoundLens({ address, network }: ContractOpts) {
    return CompoundLens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
