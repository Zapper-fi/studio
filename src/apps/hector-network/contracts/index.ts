import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { HectorNetworkBondDepository__factory } from './ethers';
import { HectorNetworkStakeBondDepository__factory } from './ethers';
import { HectorNetworkStaked__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class HectorNetworkContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  hectorNetworkBondDepository({ address, network }: ContractOpts) {
    return HectorNetworkBondDepository__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  hectorNetworkStakeBondDepository({ address, network }: ContractOpts) {
    return HectorNetworkStakeBondDepository__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  hectorNetworkStaked({ address, network }: ContractOpts) {
    return HectorNetworkStaked__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { HectorNetworkBondDepository } from './ethers';
export type { HectorNetworkStakeBondDepository } from './ethers';
export type { HectorNetworkStaked } from './ethers';
