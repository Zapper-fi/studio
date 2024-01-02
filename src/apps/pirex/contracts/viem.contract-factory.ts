import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { PirexPxCvx__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PirexViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  pirexPxCvx({ address, network }: ContractOpts) {
    return PirexPxCvx__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
