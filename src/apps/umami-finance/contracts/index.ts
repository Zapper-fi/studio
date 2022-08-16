import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { UmamiFinanceCompound__factory } from './ethers';
import { UmamiFinanceMarinate__factory } from './ethers';
import { UmamiFinanceVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class UmamiFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  umamiFinanceCompound({ address, network }: ContractOpts) {
    return UmamiFinanceCompound__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  umamiFinanceMarinate({ address, network }: ContractOpts) {
    return UmamiFinanceMarinate__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  umamiFinanceVault({ address, network }: ContractOpts) {
    return UmamiFinanceVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { UmamiFinanceCompound } from './ethers';
export type { UmamiFinanceMarinate } from './ethers';
export type { UmamiFinanceVault } from './ethers';
