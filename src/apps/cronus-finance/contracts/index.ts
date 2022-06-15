import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { CronusFinanceFarm__factory } from './ethers';
import { CronusFinanceJar__factory } from './ethers';

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
  cronusFinanceJar({ address, network }: ContractOpts) {
    return CronusFinanceJar__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { CronusFinanceFarm } from './ethers';
export type { CronusFinanceJar } from './ethers';
