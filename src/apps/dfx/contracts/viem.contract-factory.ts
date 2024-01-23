import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { DfxCurve__factory, DfxStaking__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class DfxViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  dfxCurve({ address, network }: ContractOpts) {
    return DfxCurve__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dfxStaking({ address, network }: ContractOpts) {
    return DfxStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
