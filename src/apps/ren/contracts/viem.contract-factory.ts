import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { RenDarknodeRegistry__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RenViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  renDarknodeRegistry({ address, network }: ContractOpts) {
    return RenDarknodeRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
