import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  NereusFinanceLendingPoolProvider__factory,
  NereusFinanceProtocolDataProvider__factory,
  NereusFinanceStakedTokenIncentivesController__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class NereusFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  nereusFinanceLendingPoolProvider({ address, network }: ContractOpts) {
    return NereusFinanceLendingPoolProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  nereusFinanceProtocolDataProvider({ address, network }: ContractOpts) {
    return NereusFinanceProtocolDataProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  nereusFinanceStakedTokenIncentivesController({ address, network }: ContractOpts) {
    return NereusFinanceStakedTokenIncentivesController__factory.connect(
      address,
      this.appToolkit.getNetworkProvider(network),
    );
  }
}

export type { NereusFinanceLendingPoolProvider } from './ethers';
export type { NereusFinanceProtocolDataProvider } from './ethers';
export type { NereusFinanceStakedTokenIncentivesController } from './ethers';
