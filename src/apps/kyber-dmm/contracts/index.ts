import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { KyberDmmFactory__factory } from './ethers';
import { KyberDmmMasterchef__factory } from './ethers';
import { KyberDmmPool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class KyberDmmContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  kyberDmmFactory({ address, network }: ContractOpts) {
    return KyberDmmFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  kyberDmmMasterchef({ address, network }: ContractOpts) {
    return KyberDmmMasterchef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  kyberDmmPool({ address, network }: ContractOpts) {
    return KyberDmmPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { KyberDmmFactory } from './ethers';
export type { KyberDmmMasterchef } from './ethers';
export type { KyberDmmPool } from './ethers';
