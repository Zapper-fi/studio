import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { StrikeComptroller__factory, StrikeSToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class StrikeContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  strikeComptroller({ address, network }: ContractOpts) {
    return StrikeComptroller__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  strikeSToken({ address, network }: ContractOpts) {
    return StrikeSToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { StrikeComptroller } from './ethers';
export type { StrikeSToken } from './ethers';
