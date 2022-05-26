import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { LiquidityPool__factory } from './ethers';
import { LiquidityToken__factory } from './ethers';
import { LyraRegistry__factory } from './ethers';
import { OptionMarket__factory } from './ethers';
import { OptionToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LyraAvalonContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  liquidityPool({ address, network }: ContractOpts) {
    return LiquidityPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  liquidityToken({ address, network }: ContractOpts) {
    return LiquidityToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lyraRegistry({ address, network }: ContractOpts) {
    return LyraRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  optionMarket({ address, network }: ContractOpts) {
    return OptionMarket__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  optionToken({ address, network }: ContractOpts) {
    return OptionToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { LiquidityPool } from './ethers';
export type { LiquidityToken } from './ethers';
export type { LyraRegistry } from './ethers';
export type { OptionMarket } from './ethers';
export type { OptionToken } from './ethers';
