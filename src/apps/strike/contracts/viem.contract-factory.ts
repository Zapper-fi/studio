import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { StrikeComptroller__factory, StrikeSToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class StrikeViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  strikeComptroller({ address, network }: ContractOpts) {
    return StrikeComptroller__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  strikeSToken({ address, network }: ContractOpts) {
    return StrikeSToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
