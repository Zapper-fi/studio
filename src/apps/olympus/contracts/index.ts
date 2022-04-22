import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { BondDepository__factory } from './ethers';
import { GohmContract__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class OlympusContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  bondDepository({ address, network }: ContractOpts) {
    return BondDepository__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  gohmContract({ address, network }: ContractOpts) {
    return GohmContract__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BondDepository } from './ethers';
export type { GohmContract } from './ethers';
