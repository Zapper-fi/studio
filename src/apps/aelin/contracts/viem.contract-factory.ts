import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { AelinPool__factory, AelinStaking__factory, AelinVAelin__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AelinViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  aelinPool({ address, network }: ContractOpts) {
    return AelinPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aelinStaking({ address, network }: ContractOpts) {
    return AelinStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aelinVAelin({ address, network }: ContractOpts) {
    return AelinVAelin__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
