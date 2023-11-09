import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { SushiswapKashiLendingToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SushiswapKashiViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  sushiswapKashiLendingToken({ address, network }: ContractOpts) {
    return SushiswapKashiLendingToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
