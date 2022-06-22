import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SushiswapBentobox__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SushiswapBentoboxContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  sushiswapBentobox({ address, network }: ContractOpts) {
    return SushiswapBentobox__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SushiswapBentobox } from './ethers';
