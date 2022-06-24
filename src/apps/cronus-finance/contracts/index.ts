import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { CronusFinanceFarm__factory } from './ethers';
import { CronusFinancePool__factory } from './ethers';
import { CronusFinancePoolFactory__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class CronusFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  cronusFinanceFarm({ address, network }: ContractOpts) {
    return CronusFinanceFarm__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  cronusFinancePool({ address, network }: ContractOpts) {
    return CronusFinancePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  cronusFinancePoolFactory({ address, network }: ContractOpts) {
    return CronusFinancePoolFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { CronusFinanceFarm } from './ethers';
export type { CronusFinancePool } from './ethers';
export type { CronusFinancePoolFactory } from './ethers';
