import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { WolfGameWoolPouch__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class WolfGameViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  wolfGameWoolPouch({ address, network }: ContractOpts) {
    return WolfGameWoolPouch__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
