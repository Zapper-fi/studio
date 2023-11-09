import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { XFold__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ManifoldFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  xFold({ address, network }: ContractOpts) {
    return XFold__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
