import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { ReflexerSafeJoin__factory, ReflexerUniswapV2SafeSavior__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ReflexerContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  reflexerSafeJoin({ address, network }: ContractOpts) {
    return ReflexerSafeJoin__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  reflexerUniswapV2SafeSavior({ address, network }: ContractOpts) {
    return ReflexerUniswapV2SafeSavior__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { ReflexerSafeJoin } from './ethers';
export type { ReflexerUniswapV2SafeSavior } from './ethers';
