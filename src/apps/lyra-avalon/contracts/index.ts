import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { LyraLiquidityPool__factory } from './ethers';
import { LyraLiquidityToken__factory } from './ethers';
import { LyraLpStaking__factory } from './ethers';
import { LyraOptionMarket__factory } from './ethers';
import { LyraOptionToken__factory } from './ethers';
import { LyraRegistry__factory } from './ethers';
import { LyraStkLyra__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LyraAvalonContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  lyraLiquidityPool({ address, network }: ContractOpts) {
    return LyraLiquidityPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lyraLiquidityToken({ address, network }: ContractOpts) {
    return LyraLiquidityToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lyraLpStaking({ address, network }: ContractOpts) {
    return LyraLpStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lyraOptionMarket({ address, network }: ContractOpts) {
    return LyraOptionMarket__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lyraOptionToken({ address, network }: ContractOpts) {
    return LyraOptionToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lyraRegistry({ address, network }: ContractOpts) {
    return LyraRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lyraStkLyra({ address, network }: ContractOpts) {
    return LyraStkLyra__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { LyraLiquidityPool } from './ethers';
export type { LyraLiquidityToken } from './ethers';
export type { LyraLpStaking } from './ethers';
export type { LyraOptionMarket } from './ethers';
export type { LyraOptionToken } from './ethers';
export type { LyraRegistry } from './ethers';
export type { LyraStkLyra } from './ethers';
