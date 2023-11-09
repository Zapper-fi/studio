import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { ClearpoolPool__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ClearpoolViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  clearpoolPool({ address, network }: ContractOpts) {
    return ClearpoolPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
