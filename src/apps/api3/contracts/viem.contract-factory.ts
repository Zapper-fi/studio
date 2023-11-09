import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { Api3Staking__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class Api3ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  api3Staking({ address, network }: ContractOpts) {
    return Api3Staking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
