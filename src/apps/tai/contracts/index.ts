import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { TaiCollateralJoin__factory, TaiSafeJoin__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class TaiContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  taiCollateralJoin({ address, network }: ContractOpts) {
    return TaiCollateralJoin__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  taiSafeJoin({ address, network }: ContractOpts) {
    return TaiSafeJoin__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { TaiCollateralJoin } from './ethers';
export type { TaiSafeJoin } from './ethers';
