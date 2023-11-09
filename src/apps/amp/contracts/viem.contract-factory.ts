import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { AmpStaking__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AmpViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  ampStaking({ address, network }: ContractOpts) {
    return AmpStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
