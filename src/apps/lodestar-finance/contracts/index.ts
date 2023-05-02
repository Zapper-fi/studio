import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { LodestarFinanceLens__factory, LodestarFinancePool__factory, LodestarFinanceToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LodestarFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  lodestarFinanceLens({ address, network }: ContractOpts) {
    return LodestarFinanceLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lodestarFinancePool({ address, network }: ContractOpts) {
    return LodestarFinancePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lodestarFinanceToken({ address, network }: ContractOpts) {
    return LodestarFinanceToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { LodestarFinanceLens } from './ethers';
export type { LodestarFinancePool } from './ethers';
export type { LodestarFinanceToken } from './ethers';
