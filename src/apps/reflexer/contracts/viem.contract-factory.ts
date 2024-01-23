import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { ReflexerSafeJoin__factory, ReflexerUniswapV2SafeSavior__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ReflexerViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  reflexerSafeJoin({ address, network }: ContractOpts) {
    return ReflexerSafeJoin__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  reflexerUniswapV2SafeSavior({ address, network }: ContractOpts) {
    return ReflexerUniswapV2SafeSavior__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
