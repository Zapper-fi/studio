import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { BottoGovernance__factory, BottoLiquidityMining__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class BottoViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  bottoGovernance({ address, network }: ContractOpts) {
    return BottoGovernance__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  bottoLiquidityMining({ address, network }: ContractOpts) {
    return BottoLiquidityMining__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
