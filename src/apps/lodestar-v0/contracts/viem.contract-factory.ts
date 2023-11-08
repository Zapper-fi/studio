import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { LodestarV0Comptroller__factory, LodestarV0IToken__factory, LodestarV0Lens__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class LodestarV0ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  lodestarV0Comptroller({ address, network }: ContractOpts) {
    return LodestarV0Comptroller__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lodestarV0IToken({ address, network }: ContractOpts) {
    return LodestarV0IToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lodestarV0Lens({ address, network }: ContractOpts) {
    return LodestarV0Lens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
