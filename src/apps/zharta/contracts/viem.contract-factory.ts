import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { ZhartaLendingPoolCore__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ZhartaViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  zhartaLendingPoolCore({ address, network }: ContractOpts) {
    return ZhartaLendingPoolCore__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
