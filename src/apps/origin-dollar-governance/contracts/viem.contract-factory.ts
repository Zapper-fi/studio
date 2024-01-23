import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { Veogv__factory, Wousd__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class OriginDollarGovernanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  veogv({ address, network }: ContractOpts) {
    return Veogv__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  wousd({ address, network }: ContractOpts) {
    return Wousd__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
