import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  LyraLiquidityPool__factory,
  LyraLiquidityToken__factory,
  LyraLpStaking__factory,
  LyraOptionMarket__factory,
  LyraOptionToken__factory,
  LyraRegistry__factory,
  LyraStkLyra__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class LyraAvalonViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  lyraLiquidityPool({ address, network }: ContractOpts) {
    return LyraLiquidityPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lyraLiquidityToken({ address, network }: ContractOpts) {
    return LyraLiquidityToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lyraLpStaking({ address, network }: ContractOpts) {
    return LyraLpStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lyraOptionMarket({ address, network }: ContractOpts) {
    return LyraOptionMarket__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lyraOptionToken({ address, network }: ContractOpts) {
    return LyraOptionToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lyraRegistry({ address, network }: ContractOpts) {
    return LyraRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lyraStkLyra({ address, network }: ContractOpts) {
    return LyraStkLyra__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
