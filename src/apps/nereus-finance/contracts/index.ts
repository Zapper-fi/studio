import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { NereusFinanceDataProvider__factory } from './ethers';
import { NereusFinanceLendingPoolProvider__factory } from './ethers';
import { NereusFinanceStakedTokenIncentivesController__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class NereusFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  nereusFinanceDataProvider({ address, network }: ContractOpts) {
    return NereusFinanceDataProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  nereusFinanceLendingPoolProvider({ address, network }: ContractOpts) {
    return NereusFinanceLendingPoolProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  nereusFinanceStakedTokenIncentivesController({ address, network }: ContractOpts) {
    return NereusFinanceStakedTokenIncentivesController__factory.connect(
      address,
      this.appToolkit.getNetworkProvider(network),
    );
  }
}

export type { NereusFinanceDataProvider } from './ethers';
export type { NereusFinanceLendingPoolProvider } from './ethers';
export type { NereusFinanceStakedTokenIncentivesController } from './ethers';
