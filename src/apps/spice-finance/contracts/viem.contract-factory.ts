import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { SpiceFinanceNftVault__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SpiceFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  spiceFinanceNftVault({ address, network }: ContractOpts) {
    return SpiceFinanceNftVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
