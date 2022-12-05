import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { BottoGovernance__factory } from './ethers';
import { BottoLiquidityMining__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class BottoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  bottoGovernance({ address, network }: ContractOpts) {
    return BottoGovernance__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  bottoLiquidityMining({ address, network }: ContractOpts) {
    return BottoLiquidityMining__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BottoGovernance } from './ethers';
export type { BottoLiquidityMining } from './ethers';
